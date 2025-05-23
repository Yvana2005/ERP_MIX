const { getPagination } = require("../../../../utils/query");
const { PrismaClient } = require("@prisma/client");
const {
  notifyUserOrCustomer,
  notifyAllUsers
} = require("../../../websocketNotification");
const prisma = new PrismaClient();

const createSingleSaleInvoice = async (req, res) => {
  try {
    // Validate input data
    const {
      customer_id,
      saleInvoiceProduct,
      date,
      discount,
      given_amount,
      numCommande,
      note,
      type_saleInvoice
    } = req.body;

    if (
      !customer_id ||
      !saleInvoiceProduct ||
      !date ||
      !numCommande ||
      !type_saleInvoice
    ) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    // Déterminez le type et l'ID du créateur
    const creatorType = req.authenticatedEntityType; // Type de créateur ("user" ou "customer")
    const creatorId = req.authenticatedEntity.id; // ID du créateur

    // Vérifiez si le client existe
    const customer = await prisma.customer.findUnique({
      where: { id: Number(customer_id) }
    });
    if (!customer) {
      return res.status(400).json({ error: "Client non trouvé" });
    }

    // Vérifiez si le créateur est valide
    let user = null;
    if (creatorType === "user") {
      user = await prisma.user.findUnique({
        where: { id: Number(creatorId) }
      });
      if (!user) {
        return res.status(400).json({ error: "Utilisateur non trouvé" });
      }
    } else if (creatorType === "customer") {
      const creatorCustomer = await prisma.customer.findUnique({
        where: { id: Number(creatorId) }
      });
      if (!creatorCustomer) {
        return res.status(400).json({ error: "Client créateur non trouvé" });
      }
    } else {
      return res.status(400).json({ error: "Type de créateur non valide" });
    }

    // Calculate total sale price
    let totalSalePrice = 0;
    saleInvoiceProduct.forEach((item) => {
      totalSalePrice +=
        parseFloat(item.product_sale_price) * parseFloat(item.product_quantity);
    });

    // Récupérer les produits et leurs lots
    const allProduct = await Promise.all(
      saleInvoiceProduct.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: {
            id: Number(item.product_id)
          },
          include: {
            Lots: {
              orderBy: {
                createdAt: "asc" // Trier par date de production, du plus ancien au plus récent
              }
            }
          }
        });
        if (!product) {
          throw new Error(`Produit avec ID ${item.product_id} non trouvé`);
        }
        return product;
      })
    );

    // Calculate total purchase price
    let totalPurchasePrice = 0;
    saleInvoiceProduct.forEach((item, index) => {
      totalPurchasePrice +=
        allProduct[index].purchase_price * item.product_quantity;
    });

    // Convert date to specific format
    const formattedDate = new Date(date).toISOString().split("T")[0];

    // Initialize variables
    let total_amount, due_amount, profit, amount_refunded, paid_amount;

    // Determine calculations based on invoice type
    if (type_saleInvoice === "matière_première") {
      total_amount = totalPurchasePrice;
      due_amount = 0; // Corrigé
      profit = 0;
      amount_refunded = 0;
      paid_amount = total_amount;
    } else if (type_saleInvoice === "produit_fini") {
      total_amount = totalSalePrice;
      // 1. Appliquer la remise
      const total_after_discount = total_amount - parseFloat(discount);

      // 2. Calculer le montant payé et le montant remboursé
      if (given_amount >= total_after_discount) {
        paid_amount = total_after_discount; // Le client a donné suffisamment
        amount_refunded = given_amount - total_after_discount; // Excédent à rembourser
        due_amount = 0; // Rien à devoir, facture payée
      } else {
        paid_amount = given_amount; // Le montant payé est ce que le client a donné
        amount_refunded = 0; // Pas de remboursement
        due_amount = total_after_discount - given_amount; // Montant encore dû
      }
      // 3. Calculer le profit (si applicable)
      profit = total_after_discount - totalPurchasePrice;
    } else {
      return res.status(400).json({ error: "Type de facture non valide" });
    }

    // Créez la facture si toutes les validations sont passées
    const createdInvoice = await prisma.saleInvoice.create({
      data: {
        date: new Date(formattedDate),
        total_amount: total_amount,
        type_saleInvoice: type_saleInvoice,
        discount: parseFloat(discount),
        paid_amount: paid_amount,
        given_amount: parseFloat(given_amount) || null, // Ajout du montant donné par le client
        amount_refunded: amount_refunded || null, // Ajout du montant remboursé
        numCommande: numCommande,
        profit: profit,
        due_amount: due_amount,
        customer: {
          connect: { id: Number(customer_id) }
        },
        userCreator:
          creatorType === "user"
            ? { connect: { id: Number(creatorId) } }
            : undefined,
        customerCreator:
          creatorType === "customer"
            ? { connect: { id: Number(creatorId) } }
            : undefined,
        creatorType: creatorType,
        note: note,
        saleInvoiceProduct: {
          create: saleInvoiceProduct.map((product) => ({
            product: {
              connect: { id: Number(product.product_id) }
            },
            product_quantity: Number(product.product_quantity),
            product_sale_price: parseFloat(product.product_sale_price) || null,
            product_purchase_price:
              parseFloat(product.product_purchase_price) || null
          }))
        }
      }
    });

    // Log the creation in the audit log
    await prisma.auditLog.create({
      data: {
        action: "Création d'une commande",
        auditableId: createdInvoice.id,
        auditableModel: "Commande",
        ActorAuditableModel: creatorType,
        IdUser: creatorType === "user" ? creatorId : null,
        IdCustomer: creatorType === "customer" ? creatorId : null,
        oldValues: undefined, // Les anciennes valeurs ne sont pas nécessaires pour la création
        newValues: createdInvoice,
        timestamp: new Date()
      }
    });

    if (req.authenticatedEntityType === "customer") {
      // Notifier tous les utilisateurs qu'une nouvelle commande a été créée
      await notifyAllUsers(
        createdInvoice.id,
        `Nouvelle commande créée avec ID : ${createdInvoice.numCommande} par le client ${creatorId}`
      );
    }

    if (req.authenticatedEntityType === "user") {
      // Notifier le client associé à la commande
      await notifyUserOrCustomer({
        saleId: createdInvoice.id,
        customerId: createdInvoice.customer_id,
        message: `Votre commande N°: ${createdInvoice.numCommande} a été créée et la valeur payée est de: ${createdInvoice.paid_amount} fcfa.`,
        type: "order"
      });
    }

    // Create journal entries
    if (parseFloat(paid_amount) > 0) {
      await prisma.transaction.create({
        data: {
          date: new Date(formattedDate),
          debit_id: 1,
          credit_id: 8,
          amount: parseFloat(paid_amount),
          particulars: `Cash receive on Sale Invoice #${createdInvoice.id}`,
          type: "sale",
          related_id: createdInvoice.id
        }
      });
    }

    const due_amount_journal =
      totalSalePrice - parseFloat(discount) - parseFloat(paid_amount);
    if (due_amount_journal > 0) {
      await prisma.transaction.create({
        data: {
          date: new Date(formattedDate),
          debit_id: 4,
          credit_id: 8,
          amount: due_amount_journal,
          particulars: `Due on Sale Invoice #${createdInvoice.id}`,
          type: "sale",
          related_id: createdInvoice.id
        }
      });
    }

    await prisma.transaction.create({
      data: {
        date: new Date(formattedDate),
        debit_id: 9,
        credit_id: 3,
        amount: totalPurchasePrice,
        particulars: `Cost of sales on Sale Invoice #${createdInvoice.id}`,
        type: "sale",
        related_id: createdInvoice.id
      }
    });

    // Update product quantities
    await Promise.all(
      saleInvoiceProduct.map((item) =>
        prisma.product.update({
          where: {
            id: Number(item.product_id)
          },
          data: {
            quantity: {
              decrement: Number(item.product_quantity)
            }
          }
        })
      )
    );

    // Mise à jour des lots et des quantités en stock
    for (const item of saleInvoiceProduct) {
      let remainingQuantity = item.product_quantity;

      // Parcourir les lots les plus anciens pour ce produit
      const productWithLots = allProduct.find(
        (p) => p.id === Number(item.product_id)
      );

      if (productWithLots && productWithLots.Lots) {
        // S'assurer qu'il y a des lots associés
        for (const lot of productWithLots.Lots) {
          if (remainingQuantity > 0 && lot.quantityInStock > 0) {
            const quantityToDeduct = Math.min(
              lot.quantityInStock,
              remainingQuantity
            );

            // Mise à jour de la quantité restante dans le lot
            await prisma.lot.update({
              where: {
                id: lot.id
              },
              data: {
                quantityInStock: {
                  decrement: quantityToDeduct
                }
              }
            });

            // Mettre à jour la quantité restante à déduire
            remainingQuantity -= quantityToDeduct;
          }
        }
      }
    }

    console.log(createdInvoice);
    res.json({
      createdInvoice
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};

const getAllSaleInvoice = async (req, res) => {
  if (req.query.query === "info") {
    const aggregations = await prisma.saleInvoice.aggregate({
      _count: {
        id: true
      },
      _sum: {
        total_amount: true,
        discount: true,
        due_amount: true,
        paid_amount: true,
        profit: true
      },
      where: {
        date: {
          gte: new Date(req.query.startdate),
          lte: new Date(req.query.enddate)
        },
        type_saleInvoice: "produit_fini"
      }
    });
    res.json(aggregations);
  } else {
    const { skip, limit } = getPagination(req.query);
    try {
      let aggregations, saleInvoices;
      if (req.query.user || req.query.customer) {
        if (req.query.count) {
          [aggregations, saleInvoices] = await prisma.$transaction([
            // get info of selected parameter data
            prisma.saleInvoice.aggregate({
              _count: {
                id: true
              },
              _sum: {
                total_amount: true,
                discount: true,
                due_amount: true,
                paid_amount: true,
                profit: true
              },
              where: {
                date: {
                  gte: new Date(req.query.startdate),
                  lte: new Date(req.query.enddate)
                },
                userCreatorId: Number(req.query.user),
                customer_id: Number(req.query.customer),
                type_saleInvoice: "produit_fini"
              }
            }),
            // get saleInvoice paginated and by start and end date
            prisma.saleInvoice.findMany({
              orderBy: [
                {
                  id: "desc"
                }
              ],
              skip: Number(skip),
              take: Number(limit),
              include: {
                saleInvoiceProduct: {
                  include: {
                    product: true
                  }
                },
                customer: {
                  select: {
                    id: true,
                    username: true,
                    role: true
                  }
                },
                userCreator: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                customerCreator: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              },
              where: {
                date: {
                  gte: new Date(req.query.startdate),
                  lte: new Date(req.query.enddate)
                },
                userCreatorId: Number(req.query.user),
                customer_id: Number(req.query.customer),
                type_saleInvoice: "produit_fini"
              }
            })
          ]);
        } else {
          [aggregations, saleInvoices] = await prisma.$transaction([
            // get info of selected parameter data
            prisma.saleInvoice.aggregate({
              _count: {
                id: true
              },
              _sum: {
                total_amount: true,
                discount: true,
                due_amount: true,
                paid_amount: true,
                profit: true
              },
              where: {
                date: {
                  gte: new Date(req.query.startdate),
                  lte: new Date(req.query.enddate)
                },
                userCreatorId: Number(req.query.user),
                type_saleInvoice: "produit_fini"
              }
            }),
            // get saleInvoice paginated and by start and end date
            prisma.saleInvoice.findMany({
              orderBy: [
                {
                  id: "desc"
                }
              ],
              include: {
                saleInvoiceProduct: {
                  include: {
                    product: true
                  }
                },
                customer: {
                  select: {
                    id: true,
                    username: true,
                    role: true
                  }
                },
                userCreator: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                customerCreator: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              },
              where: {
                date: {
                  gte: new Date(req.query.startdate),
                  lte: new Date(req.query.enddate)
                },
                userCreatorId: Number(req.query.user),
                customer_id: Number(req.query.customer),
                type_saleInvoice: "produit_fini"
              }
            })
          ]);
        }
      } else {
        if (req.query.count) {
          [aggregations, saleInvoices] = await prisma.$transaction([
            // get info of selected parameter data
            prisma.saleInvoice.aggregate({
              _count: {
                id: true
              },
              _sum: {
                total_amount: true,
                discount: true,
                due_amount: true,
                paid_amount: true,
                profit: true
              },
              where: {
                date: {
                  gte: new Date(req.query.startdate),
                  lte: new Date(req.query.enddate)
                },
                type_saleInvoice: "produit_fini"
              }
            }),
            // get saleInvoice paginated and by start and end date
            prisma.saleInvoice.findMany({
              orderBy: [
                {
                  id: "desc"
                }
              ],
              skip: Number(skip),
              take: Number(limit),
              include: {
                saleInvoiceProduct: {
                  include: {
                    product: true
                  }
                },
                customer: {
                  select: {
                    id: true,
                    username: true,
                    role: true
                  }
                },
                userCreator: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                customerCreator: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              },
              where: {
                date: {
                  gte: new Date(req.query.startdate),
                  lte: new Date(req.query.enddate)
                },
                type_saleInvoice: "produit_fini"
              }
            })
          ]);
        } else {
          [aggregations, saleInvoices] = await prisma.$transaction([
            // get info of selected parameter data
            prisma.saleInvoice.aggregate({
              _count: {
                id: true
              },
              _sum: {
                total_amount: true,
                discount: true,
                due_amount: true,
                paid_amount: true,
                profit: true
              },
              where: {
                date: {
                  gte: new Date(req.query.startdate),
                  lte: new Date(req.query.enddate)
                },
                type_saleInvoice: "produit_fini"
              }
            }),
            // get saleInvoice paginated and by start and end date
            prisma.saleInvoice.findMany({
              orderBy: [
                {
                  id: "desc"
                }
              ],
              include: {
                saleInvoiceProduct: {
                  include: {
                    product: true
                  }
                },
                customer: {
                  select: {
                    id: true,
                    username: true,
                    role: true
                  }
                },
                userCreator: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                customerCreator: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              },
              where: {
                date: {
                  gte: new Date(req.query.startdate),
                  lte: new Date(req.query.enddate)
                },
                type_saleInvoice: "produit_fini"
              }
            })
          ]);
        }
      }
      // modify data to actual data of sale invoice's current value by adjusting with transactions and returns
      const transactions = await prisma.transaction.findMany({
        where: {
          type: "sale",
          related_id: {
            in: saleInvoices.map((item) => item.id)
          },
          OR: [
            {
              debit_id: 1
            },
            {
              debit_id: 2
            }
          ]
        }
      });
      // the return that paid back to customer on return invoice
      const transactions2 = await prisma.transaction.findMany({
        where: {
          type: "sale_return",
          related_id: {
            in: saleInvoices.map((item) => item.id)
          },
          OR: [
            {
              credit_id: 1
            },
            {
              credit_id: 2
            }
          ]
        }
      });
      // calculate the discount given amount at the time of make the payment
      const transactions3 = await prisma.transaction.findMany({
        where: {
          type: "sale",
          related_id: {
            in: saleInvoices.map((item) => item.id)
          },
          debit_id: 14
        },
        include: {
          debit: {
            select: {
              name: true
            }
          },
          credit: {
            select: {
              name: true
            }
          }
        }
      });
      const returnSaleInvoice = await prisma.returnSaleInvoice.findMany({
        where: {
          saleInvoice_id: {
            in: saleInvoices.map((item) => item.id)
          }
        }
      });
      // calculate paid amount and due amount of individual sale invoice from transactions and returnSaleInvoice and attach it to saleInvoices
      const allSaleInvoice = saleInvoices.map((item) => {
        const paidAmount = transactions
          .filter((transaction) => transaction.related_id === item.id)
          .reduce((acc, curr) => acc + curr.amount, 0);
        const paidAmountReturn = transactions2
          .filter((transaction) => transaction.related_id === item.id)
          .reduce((acc, curr) => acc + curr.amount, 0);
        const discountGiven = transactions3
          .filter((transaction) => transaction.related_id === item.id)
          .reduce((acc, curr) => acc + curr.amount, 0);
        const returnAmount = returnSaleInvoice
          .filter(
            (returnSaleInvoice) => returnSaleInvoice.saleInvoice_id === item.id
          )
          .reduce((acc, curr) => acc + curr.total_amount, 0);
        const totalUnitMeasurement = item.saleInvoiceProduct.reduce(
          (acc, curr) =>
            acc +
            Number(curr.product.unit_measurement) *
              Number(curr.product_quantity),
          0
        );
        return {
          ...item,
          paid_amount: paidAmount,
          discount: item.discount + discountGiven,
          due_amount:
            item.total_amount -
            item.discount -
            paidAmount -
            returnAmount +
            paidAmountReturn -
            discountGiven,
          total_unit_measurement: totalUnitMeasurement
        };
      });
      // calculate total paid_amount and due_amount from allSaleInvoice and attach it to aggregations
      const totalPaidAmount = allSaleInvoice.reduce(
        (acc, curr) => acc + curr.paid_amount,
        0
      );
      const totalDueAmount = allSaleInvoice.reduce(
        (acc, curr) => acc + curr.due_amount,
        0
      );
      const totalUnitMeasurement = allSaleInvoice.reduce(
        (acc, curr) => acc + curr.total_unit_measurement,
        0
      );
      const totalUnitQuantity = allSaleInvoice
        .map((item) =>
          item.saleInvoiceProduct.map((item) => item.product_quantity)
        )
        .flat()
        .reduce((acc, curr) => acc + curr, 0);
      const totalDiscountGiven = allSaleInvoice.reduce(
        (acc, curr) => acc + curr.discount,
        0
      );

      aggregations._sum.paid_amount = totalPaidAmount;
      aggregations._sum.discount = totalDiscountGiven;
      aggregations._sum.due_amount = totalDueAmount;
      aggregations._sum.total_unit_measurement = totalUnitMeasurement;
      aggregations._sum.total_unit_quantity = totalUnitQuantity;
      res.json({
        aggregations,
        allSaleInvoice
      });
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  }
};

const getSingleSaleInvoice = async (req, res) => {
  try {
    const singleSaleInvoice = await prisma.saleInvoice.findUnique({
      where: {
        id: Number(req.params.id)
      },
      include: {
        saleInvoiceProduct: {
          include: {
            product: true
          }
        },
        customer: true,
        userCreator: {
          select: {
            id: true,
            username: true
          }
        },
        customerCreator: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    // view the transactions of the sale invoice
    const transactions = await prisma.transaction.findMany({
      where: {
        related_id: Number(req.params.id),
        OR: [
          {
            type: "sale"
          },
          {
            type: "sale_return"
          }
        ]
      },
      include: {
        debit: {
          select: {
            name: true
          }
        },
        credit: {
          select: {
            name: true
          }
        }
      }
    });
    // transactions of the paid amount
    const transactions2 = await prisma.transaction.findMany({
      where: {
        type: "sale",
        related_id: Number(req.params.id),
        OR: [
          {
            debit_id: 1
          },
          {
            debit_id: 2
          }
        ]
      },
      include: {
        debit: {
          select: {
            name: true
          }
        },
        credit: {
          select: {
            name: true
          }
        }
      }
    });
    // for total return amount
    const returnSaleInvoice = await prisma.returnSaleInvoice.findMany({
      where: {
        saleInvoice_id: Number(req.params.id)
      },
      include: {
        returnSaleInvoiceProduct: {
          include: {
            product: true
          }
        }
      }
    });
    // calculate the discount given amount at the time of make the payment
    const transactions3 = await prisma.transaction.findMany({
      where: {
        type: "sale",
        related_id: Number(req.params.id),
        debit_id: 14
      },
      include: {
        debit: {
          select: {
            name: true
          }
        },
        credit: {
          select: {
            name: true
          }
        }
      }
    });
    // calculate the total amount return back to customer for return sale invoice from transactions
    // transactions of the paid amount
    const transactions4 = await prisma.transaction.findMany({
      where: {
        type: "sale_return",
        related_id: Number(req.params.id),
        OR: [
          {
            credit_id: 1
          },
          {
            credit_id: 2
          }
        ]
      },
      include: {
        debit: {
          select: {
            name: true
          }
        },
        credit: {
          select: {
            name: true
          }
        }
      }
    });
    const paidAmountReturn = transactions4.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    let status = "IMPAYÉ";
    // sum total amount of all transactions
    const totalPaidAmount = transactions2.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    // sum of total discount given amount at the time of make the payment
    const totalDiscountAmount = transactions3.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    // check if total transaction amount is equal to total_amount - discount - return invoice amount
    const totalReturnAmount = returnSaleInvoice.reduce(
      (acc, item) => acc + item.total_amount,
      0
    );
    console.log(singleSaleInvoice.total_amount);
    console.log(singleSaleInvoice.discount);
    console.log(totalPaidAmount);
    console.log(totalDiscountAmount);
    console.log(totalReturnAmount);
    console.log(paidAmountReturn);
    const dueAmount =
      singleSaleInvoice.total_amount -
      singleSaleInvoice.discount -
      totalPaidAmount -
      totalDiscountAmount -
      totalReturnAmount +
      paidAmountReturn;
    if (dueAmount === 0) {
      status = "PAYÉ";
    }
    // calculate total unit_measurement
    const totalUnitMeasurement = singleSaleInvoice.saleInvoiceProduct.reduce(
      (acc, item) =>
        acc + Number(item.product.unit_measurement) * item.product_quantity,
      0
    );
    // console.log(totalUnitMeasurement);
    res.json({
      status,
      totalPaidAmount,
      totalReturnAmount,
      dueAmount,
      totalUnitMeasurement,
      singleSaleInvoice,
      returnSaleInvoice,
      transactions
    });
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateSaleInvoice = async (req, res) => {
  const { id } = req.params;
  const { delivred, ready } = req.body;

  try {
    // Étape 1: Récupération des anciennes valeurs
    const existingInvoice = await prisma.saleInvoice.findUnique({
      where: { id: Number(id) },
      include: { customer: true } // Inclure les informations du client si nécessaire
    });

    // Vérifier si la commande existe
    if (!existingInvoice) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    const updatedInvoice = await prisma.saleInvoice.update({
      where: { id: Number(id) },
      data: {
        ...(delivred !== undefined && { delivred }),
        ...(ready !== undefined && { ready })
      },
      include: {
        customer: true // Inclure les informations du client
      }
    });

    // Envoyer une notification au client associé à la commande si elle est prête
    if (ready === true) {
      const clientId = updatedInvoice.customer.id; // Utilisation de l'id du client associé à la commande

      // Envoi de la notification au client
      const client = await prisma.customer.findUnique({
        where: { id: clientId }
      });

      if (client) {
        // Assurez-vous que notifyUser accepte l'identifiant du client
        await notifyUserOrCustomer({
          saleId: updatedInvoice.id,
          customerId: updatedInvoice.customer_id,
          message: `Votre commande N°: ${updatedInvoice.numCommande} est prête.`,
          type: "update_order"
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        action: "Modification des données d'une commande",
        auditableId: updatedInvoice.id,
        auditableModel: "Commande",
        ActorAuditableModel: req.authenticatedEntityType,
        IdUser:
          req.authenticatedEntityType === "user"
            ? req.authenticatedEntity.id
            : null,
        IdCustomer:
          req.authenticatedEntityType === "customer"
            ? req.authenticatedEntity.id
            : null,
        oldValues: existingInvoice, // Les anciennes valeurs ne sont pas nécessaires pour la création
        newValues: updatedInvoice,
        timestamp: new Date()
      }
    });

    // Notifier aussi les utilisateurs/admins
    console.log(updatedInvoice);

    return res.status(200).json({
      message: "Facture mise à jour avec succès",
      data: updatedInvoice
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la facture :",
      error.message
    );
    return res.status(500).json({ error: error.message });
  }
};

const cancelOrDeleteSaleInvoice = async (req, res) => {
  try {
    const { id } = req.params; // Utiliser "id"

    // Afficher l'ID pour vérifier sa réception
    console.log("ID de la facture reçu : ", id);

    // Convertir en entier et vérifier si c'est un nombre valide
    const invoiceIdNumber = Number(id);

    if (isNaN(invoiceIdNumber)) {
      return res.status(400).json({ error: "ID de facture invalide" });
    }

    // Récupérer les produits associés à la facture
    const saleInvoiceProducts = await prisma.saleInvoiceProduct.findMany({
      where: {
        invoice_id: invoiceIdNumber // Utiliser l'ID converti
      },
      include: {
        product: true // Inclure les détails des produits
      }
    });

    // Restaurer les quantités en stock
    for (const saleInvoiceProduct of saleInvoiceProducts) {
      await prisma.product.update({
        where: {
          id: saleInvoiceProduct.product_id
        },
        data: {
          quantity:
            saleInvoiceProduct.product.quantity +
            saleInvoiceProduct.product_quantity
        }
      });
    }

    // Supprimer la facture
    await prisma.saleInvoice.delete({
      where: {
        id: invoiceIdNumber
      }
    });

    console.log(
      `La commande avec l'ID ${id} a été annulée et les produits ont été restaurés en stock.`
    );
    return res.status(200).json({
      message: "Facture mise à jour avec succès",
      data: saleInvoiceProducts
    });
  } catch (error) {
    console.error("Erreur lors de l'annulation de la commande : ", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de l'annulation de la commande." });
  }
};

module.exports = {
  createSingleSaleInvoice,
  getAllSaleInvoice,
  getSingleSaleInvoice,
  updateSaleInvoice,
  cancelOrDeleteSaleInvoice
};

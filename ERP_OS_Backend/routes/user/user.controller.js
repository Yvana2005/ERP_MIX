const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
require("dotenv").config();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const checkMatricule = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const userWithemployeeId = await prisma.user.findUnique({
      where: {
        employeeId : employeeId
      }
    });

    if (userWithemployeeId) {
      return res.json({ success: true, message: "ID number found" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "ID number not found" });
    }
  } catch (error) {
    console.error("Error checking ID number:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cherche d'abord comme utilisateur
    let user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    let userType = "user"; // Par défaut, l'utilisateur est un "user"

    // Si ce n'est pas un utilisateur, cherchez comme client
    if (!user) {
      user = await prisma.customer.findUnique({
        where: {
          email: email // Utilisez `email` pour la recherche de client
        }
      });
      userType = "customer"; // Si trouvé comme client, définissez userType sur "customer"
    }

    // Vérifiez le mot de passe pour l'utilisateur trouvé
    if (user && bcrypt.compareSync(password, user.password)) {
      // Obtenez les permissions basées sur le rôle de l'utilisateur ou du client
      let permissions = [];
      if (user.roleId) {
        const role = await prisma.role.findUnique({
          where: {
            id: user.roleId
          },
          include: {
            rolePermission: {
              include: {
                permission: true
              }
            }
          }
        });
        permissions = role.rolePermission.map((rp) => rp.permission.name);
      }

      // Création du token JWT
      const token = jwt.sign(
        { sub: user.id, permissions, role: user.roleId, userType: userType }, // Ajoutez `userType` pour indiquer le type d'entité
        secret,
        { expiresIn: "24h"}
      );

      // Supprimez le mot de passe avant de renvoyer les informations de l'utilisateur
      const { password, ...userWithoutPassword } = user;

      return res.json({
        ...userWithoutPassword,
        token
      });
    } else {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    // Vérifier les champs obligatoires
    if (
      !req.body.userName ||
      !req.body.password ||
      !req.body.email ||
      !req.body.roleId
    ) {
      return res
        .status(400)
        .json({ message: "Les champs obligatoires sont manquants." });
    }

    // Convertir les dates et vérifier la validité
    const join_date = req.body.joinDate
      ? new Date(req.body.joinDate).toISOString().split("T")[0]
      : null;


    if (!join_date) {
      return res
        .status(400)
        .json({ message: "Les dates ne sont pas valides." });
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    // Créer l'utilisateur
    const createUser = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: hash,
        email: req.body.email,
        phone: req.body.phone,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        country: req.body.country,
        Birthday: req.body.Birthday,
        maritalstatus: req.body.maritalstatus,
        speech: req.body.speech,
        fathername: req.body.fathername,
        mothername: req.body.mothername,

        emergencyname1: req.body.emergencyname1,
        emergencyforename1: req.body.emergencyforename1,
        emergencyPhone1: req.body.emergencyPhone1,
        emergencylink1: req.body.emergencylink1,

        CnpsId: req.body.CnpsId,
        uppername: req.body.uppername,
        Category: req.body.Category,
        gender: req.body.gender,
        joinDate: join_date,
        employeeId: req.body.employeeId,
        bloodGroup: req.body.bloodGroup,
        image: req.body.image,
        employmentStatusId: req.body.employmentStatusId,
        departmentId: req.body.departmentId,
        roleId: req.body.roleId,
        designationHistory: {
          create: {
            designationId: req.body.designationId,
            startDate: new Date(req.body.designationStartDate),
            endDate: new Date(req.body.designationEndDate),
            comment: req.body.designationComment
          }
        },
        salaryHistory: {
          create: {
            salary: req.body.salary,
            startDate: new Date(req.body.salaryStartDate),
            endDate: new Date(req.body.salaryEndDate),
            comment: req.body.salaryComment
          }
        },
        educations: {
          create: req.body.educations.map((e) => {
            return {
              degree: e.degree,
              institution: e.institution,
              qualification: e.qualification,
              skill: e.skill,
              fieldOfStudy: e.fieldOfStudy,
              result: e.result,
              startDate: new Date(e.studyStartDate),
              endDate: new Date(e.studyEndDate)
            };
          })
        }
      }
    });

    // Créer un audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATION DU PERSONNEL",
        auditableId: createUser.id,
        auditableModel: "Personnel",
        ActorAuditableModel: req.authenticatedEntityType,
        IdUser:
          req.authenticatedEntityType === "user"
            ? req.authenticatedEntity.id
            : null,
        IdCustomer:
          req.authenticatedEntityType === "customer"
            ? req.authenticatedEntity.id
            : null,
        oldValues: undefined,
        newValues: createUser,
        timestamp: new Date()
      }
    });

    // Supprimer le mot de passe du retour
    const { password, ...userWithoutPassword } = createUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error); // Ajoutez un log d'erreur
    res.status(500).json({
      message: "Erreur interne du serveur.",
      error: error.message || error // Retourner un message d'erreur plus précis
    });
  }
};

const getAllUser = async (req, res) => {
  if (req.query.query === "all") {
    try {
      const allUser = await prisma.user.findMany({
        include: {
          designationHistory: {
            include: {
              designation: true
            }
          },
          saleInvoice: true,
          salaryHistory: true,
          educations: true,
          employmentStatus: true,
          department: true,
          role: true,
          awardHistory: true
        }
      });
      res.json(
        allUser
          .map((u) => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
          })
          .sort((a, b) => a.id - b.id)
      );
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else if (req.query.status === "false") {
    try {
      const allUser = await prisma.user.findMany({
        where: {
          status: false
        },
        include: {
          saleInvoice: true
        }
      });
      res.json(
        allUser
          .map((u) => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
          })
          .sort((a, b) => a.id - b.id)
      );
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    try {
      const allUser = await prisma.user.findMany({
        where: {
          status: true
        },
        include: {
          designationHistory: {
            include: {
              designation: true
            }
          },
          saleInvoice: true,
          salaryHistory: true,
          educations: true,
          employmentStatus: true,
          department: true,
          role: true,
          awardHistory: true
        }
      });
      res.json(
        allUser

          .map((u) => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
          })
          .sort((a, b) => a.id - b.id)
      );
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
};

const getSingleUser = async (req, res) => {
  const singleUser = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id)
    },
    include: {
      designationHistory: {
        include: {
          designation: true
        }
      },
      saleInvoice: true,
      salaryHistory: true,
      educations: true,
      employmentStatus: true,
      department: true,
      role: true,
      awardHistory: {
        include: {
          award: true
        }
      },
      leaveApplication: {
        orderBy: {
          id: "desc"
        },
        take: 5
      },
      attendance: {
        orderBy: {
          id: "desc"
        },
        take: 1
      }
    }
  });

  const leaveDays = await prisma.leaveApplication.findMany({
    where: {
      userId: Number(req.params.id),
      status: "ACCEPTED",
      acceptLeaveFrom: {
        gte: new Date(new Date().getFullYear(), 0, 1)
      },
      acceptLeaveTo: {
        lte: new Date(new Date().getFullYear(), 11, 31)
      }
    }
  });
  const paidLeaveDays = leaveDays
    .filter((l) => l.leaveType === "PAID")
    .reduce((acc, item) => {
      return acc + item.leaveDuration;
    }, 0);
  const unpaidLeaveDays = leaveDays
    .filter((l) => l.leaveType === "UNPAID")
    .reduce((acc, item) => {
      return acc + item.leaveDuration;
    }, 0);

  singleUser.paidLeaveDays = paidLeaveDays;
  singleUser.unpaidLeaveDays = unpaidLeaveDays;

  const id = parseInt(req.params.id);

  // only allow admins and owner to access other user records
  // console.log(id !== req.auth.sub && !req.auth.permissions.includes("viewUser"));
  if (id !== req.auth.sub && !req.auth.permissions.includes("viewUser")) {
    return res
      .status(401)
      .json({ message: "Unauthorized. You are not an admin" });
  }

  if (!singleUser) return;
  const { password, ...userWithoutPassword } = singleUser;
  res.json(userWithoutPassword);
};

const updateSingleUser = async (req, res) => {
  const id = parseInt(req.params.id);
  // only allow admins and owner to edit other user records
  // console.log(
  //   id !== req.auth.sub && !req.auth.permissions.includes("updateUser")
  // );
  if (id !== req.auth.sub && !req.auth.permissions.includes("updateUser")) {
    return res.status(401).json({
      message: "Unauthorized. You can only edit your own record."
    });
  }
  try {
    // admin can change all fields
    if (req.auth.permissions.includes("updateUser")) {
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      const join_date = new Date(req.body.joinDate)
        .toISOString()
        .split("T")[0];
      
      const updateUser = await prisma.user.update({
        where: {
          id: Number(req.params.id)
        },
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName,
          password: hash,
          email: req.body.email,
          phone: req.body.phone,
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          zipCode: req.body.zipCode,
          country: req.body.country,
          Birthday: req.body.Birthday,
          maritalstatus: req.body.maritalstatus,
          speech: req.body.speech,
          fathername: req.body.fathername,
          mothername: req.body.mothername,
          emergencyname1: req.body.emergencyname1,
          emergencyforename1: req.body.emergencyforename1,
          emergencyPhone1: req.body.emergencyPhone1,
          emergencylink1: req.body.emergencylink1,
          CnpsId: req.body.CnpsId,
          uppername: req.body.uppername,
          Category: req.body.Category,
          gender: req.body.gender,
          joinDate: join_date,
          employeeId: req.body.employeeId,
          bloodGroup: req.body.bloodGroup,
          image: req.body.image,
          employmentStatusId: req.body.employmentStatusId,
          departmentId: req.body.departmentId,
          roleId: req.body.roleId
        }
      });
      const { password, ...userWithoutPassword } = updateUser;

      const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête

      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) }
      });
      // Vérifier si le user existe
      if (!existingUser) {
        return res.status(404).json({ message: "User non trouvé" });
      }

      await prisma.auditLog.create({
        data: {
          action: "MODIFICATION DU PERSONNEL",
          auditableId: userWithoutPassword.id,
          auditableModel: "Personnel",
          ActorAuditableModel: req.authenticatedEntityType,
          IdUser:
            req.authenticatedEntityType === "user"
              ? req.authenticatedEntity.id
              : null,
          IdCustomer:
            req.authenticatedEntityType === "customer"
              ? req.authenticatedEntity.id
              : null,
          oldValues: existingUser, // Les anciennes valeurs ne sont pas nécessaires pour la création
          newValues: userWithoutPassword,
          timestamp: new Date()
        }
      });
      res.json(userWithoutPassword);
    } else {
      // owner can change only password
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      const updateUser = await prisma.user.update({
        where: {
          id: Number(req.params.id)
        },
        data: {
          password: hash
        }
      });
      const { password, ...userWithoutPassword } = updateUser;

      const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête

      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) }
      });
      // Vérifier si le user existe
      if (!existingUser) {
        return res.status(404).json({ message: "User non trouvé" });
      }

      await prisma.auditLog.create({
        data: {
          action: "MODIFICATION DU PERSONNEL",
          auditableId: userWithoutPassword.id,
          auditableModel: "Personnel",
          ActorAuditableModel: req.authenticatedEntityType,
          IdUser:
            req.authenticatedEntityType === "user"
              ? req.authenticatedEntity.id
              : null,
          IdCustomer:
            req.authenticatedEntityType === "customer"
              ? req.authenticatedEntity.id
              : null,
          oldValues: existingUser, // Les anciennes valeurs ne sont pas nécessaires pour la création
          newValues: userWithoutPassword,
          timestamp: new Date()
        }
      });

      res.json(userWithoutPassword);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteSingleUser = async (req, res) => {
  // const id = parseInt(req.params.id);
  // only allow admins to delete other user records
  if (!req.auth.permissions.includes("deleteUser")) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Only admin can delete." });
  }
  try {
    const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête

    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    // Vérifier si le user existe
    if (!existingUser) {
      return res.status(404).json({ message: "User non trouvé" });
    }

    const deleteUser = await prisma.user.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        status: req.body.status
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "SUPPRESSION DU PERSONNEL",
        auditableId: deleteUser.id,
        auditableModel: "Personnel",
        ActorAuditableModel: req.authenticatedEntityType,
        IdUser:
          req.authenticatedEntityType === "user"
            ? req.authenticatedEntity.id
            : null,
        IdCustomer:
          req.authenticatedEntityType === "customer"
            ? req.authenticatedEntity.id
            : null,
        oldValues: existingUser, // Les anciennes valeurs ne sont pas nécessaires pour la création
        newValues: deleteUser,
        timestamp: new Date()
      }
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  login,
  register,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  checkMatricule
};

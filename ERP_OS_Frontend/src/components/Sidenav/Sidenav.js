import { useState, useEffect, useContext } from "react";
import {
  CheckOutlined,
  FileSyncOutlined,
  FundOutlined,
  HomeOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  SettingOutlined,
  FolderAddOutlined,
  FileAddOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  SnippetsOutlined,
  UserSwitchOutlined,
  InboxOutlined,
  FileDoneOutlined,
  FileOutlined,
  ClockCircleOutlined,
	UsergroupDeleteOutlined,
	RocketOutlined,
	NotificationFilled,
	TrophyFilled,
	SubnodeOutlined,
	CalendarOutlined,
	PieChartFilled,
	FlagFilled,
	WalletOutlined,
	FlagOutlined,
	QuestionCircleOutlined
} from "@ant-design/icons";
import { Divider, Menu, Tooltip } from "antd";
import { BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, bsGraphDown, BsGraphUpArrow }
  from 'react-icons/bs'
import React from "react";

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/images/sai-i-lama-logo.png";
import NotificationIcon from "../Component_SMS/notification/NotificationIcon";
import { loadProduct } from "../../redux/actions/product/getAllProductAction";
import { loadAllSale } from "../../redux/actions/sale/getSaleAction";
import getUserFromToken from "../../utils/getUserFromToken";
// import DueClientNotification from "../notification/DueClientNotification";
import getPermissions from "../../utils/getPermissions";
import moment from "moment";
import { ModuleContext } from "../layouts/ModuleContext";
// import ReadyCommandeNotification from "../notification/ReadyCommandeNotification";
// import styles from "./Sidenav.module.css";
const pdfFile = require("./help.pdf");

const Test = (color) => {
  const userRole = localStorage.getItem("role");
  const user = getUserFromToken();
  const isProfessional = userRole === "Professionnel";
  const isParticulier = userRole === "Particulier";

  const isProRole = isProfessional
    ? "Professionnel"
    : isParticulier
    ? "Particulier"
    : null;

  const permissions = getPermissions();
  const hasPermission = (item) => {
    return permissions?.includes(item ? item : "");
  };
  const { selectedModule, handleModuleClick } = useContext(ModuleContext);

  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [dueClientList, setDueClientList] = useState([]);
  // const redirectToHome = () => {
	// 	window.location.href = "http://192.168.1.176";
	// };
  // const redirectToHR = () => {
	// 	window.location.href = "http://192.168.1.176";
	// };

  useEffect(() => {
    dispatch(loadProduct({ status: "true", page: 1, limit: 10 }));
  }, []);
  useEffect(() => {
    dispatch(
      loadAllSale({
        status: "true",
        page: 1,
        limit: 100,
        startdate: moment().startOf("month"),
        enddate: moment().endOf("month"),
        user: ""
      })
    );
  }, []);

  const productsList = useSelector((state) => state.products.list);
  const Clientlist = useSelector((state) => state.sales.list);

  // const filteredList = dueClientList?.filter((item) => item.customer.name === user_id);

  useEffect(() => {
    setList(productsList);
    setDueClientList(Clientlist);
  }, [productsList, Clientlist]);

  const getMenuItems = () => {
    switch (selectedModule) {
      case "MSC": // Module Supply Chain
        return menu.slice(4, 9); // Afficher les 4 premiers éléments
      case "MV": // Module Vente
        return menu.slice(9, 12).concat(menu.slice(12, 13)); 
      case "MR": // Module RH
        return menu.slice(14, 29); // Afficher de Dashboard à Projet
      case "Global": // Module Supply Chain
        return menu.slice(0, 4);
      default:
        return menu.slice(3);
    }
  };

  const menu = [
    !isProRole &&{
      label: (
        <NavLink to="/dashboardsms">
          <span>SMS</span>
        </NavLink>
      ),
      key: "MSC",
      icon: <BsGraphUpArrow />,
    },
    !isProRole &&{
      label: (
        <NavLink to="/dashboardsms">
          <span>VENTES</span>
        </NavLink>
      ),
      key: "MV",
      icon: <BsFillArchiveFill />,
    },
    isProRole &&{
      label: (
        <NavLink to="/pos">
          <span>VENTES</span>
        </NavLink>
      ),
      key: "MV",
      icon: <BsFillArchiveFill />,
    },
    !isProRole &&{
      label: (
        <NavLink to="/admin/dashboardrh">
          <span>RH</span>
        </NavLink>
      ),
      key: "MR",
      icon: <BsPeopleFill />,
    },
    
    
    !isProRole &&
      hasPermission("viewDashboard") && {
        label: (
          <NavLink to="/dashboardsms">
            <span>TABLEAU DE BORD</span>
          </NavLink>
        ),
        key: "MSC",
        icon: <HomeOutlined />
      },
    
    !isProRole &&
      (hasPermission("createProduct") ||
        hasPermission("viewProduct") ||
        hasPermission("updateProduct") ||
        hasPermission("deleteProduct") ||
        hasPermission("createProductCategory") ||
        hasPermission("viewProductCategory") ||
        hasPermission("updateProductCategory") ||
        hasPermission("deleteProductCategory")) && {
        label: "MATIÈRE PREMIÈRE",
        key: "productmatière",  // !isProRole &&
        //   (hasPermission("createSupplier") ||
        //     hasPermission("viewSupplier") ||
        //     hasPermission("updateSupplier") ||
        //     hasPermission("deleteSupplier") ||
        //     hasPermission("createPurchaseInvoice") ||
        //     hasPermission("viewPurchaseInvoice") ||
        //     hasPermission("updatePurchaseInvoice") ||
        //     hasPermission("deletePurchaseInvoice")) && {
        //     label: "APPROVISIONNEMENT",
        //     key: "purchaseSection",
        //     icon: <PlusSquareOutlined />,
        //     children: [
        //       {
        //         label: (
        //           <NavLink to="/purchase">
        //             <span>Facture</span>
        //           </NavLink>
        //         ),
        //         key: "newPurchase",
        //         icon: <SnippetsOutlined />
        //       }
        //     ]
        //   },
        icon: <PlusSquareOutlined />,
        children: [
          {
            label: (
              <NavLink to="/productMat">
                <span>Ajouter une Matière Première</span>
              </NavLink>
            ),
            key: "MSC",
            icon: <FileAddOutlined />
          },
          {
            label: (
              <NavLink to="/productMatlist">
                <span>Liste de Matières Premières</span>
              </NavLink>
            ),
            key: "MSC",
            icon: <UnorderedListOutlined />
          },
          {
            label: (
              <NavLink to="/stockproductMatlist">
                <span>Sortie de la Matière Première</span>
              </NavLink>
            ),
            key: "MSC",
            icon: <UnorderedListOutlined />
          }
          // {
          //   label: (
          //     <NavLink to="/saleMatList">
          //       <span>Liste Des Matières Sortie</span>
          //     </NavLink>
          //   ),
          //   key: "salelistproductmatière2",
          //   icon: <UnorderedListOutlined />
          // }
        ]
      },
    !isProRole &&
      (hasPermission("createProduct") ||
        hasPermission("viewProduct") ||
        hasPermission("updateProduct") ||
        hasPermission("deleteProduct") ||
        hasPermission("createProductCategory") ||
        hasPermission("viewProductCategory") ||
        hasPermission("updateProductCategory") ||
        hasPermission("deleteProductCategory")) && {
        label: "PRODUIT",
        key: "product",
        icon: <ShopOutlined />,
        children: [
          {
            label: (
              <NavLink to="/product">
                <span>Ajouter un produit</span>
              </NavLink>
            ),
            key: "MSC",
            icon: <FileAddOutlined />
          },
          {
            label: (
              <NavLink to="/productlist">
                <span>Liste des produits</span>
              </NavLink>
            ),
            key: "MSC",
            icon: <UnorderedListOutlined />
          }
        ]
      },
    !isProRole &&
      (hasPermission("createCustomer") ||
        hasPermission("viewCustomer") ||
        hasPermission("updateCustomer") ||
        hasPermission("deleteCustomer")) && {
        label: (
          <NavLink to="/customer">
            <span>CLIENT</span>
          </NavLink>
        ),
        key: "MSC",
        icon: <UserOutlined />
      },
     
    // !isProRole &&
    //   (hasPermission("viewUser") ||
    //     hasPermission("updateUser") ||
    //     hasPermission("deleteUser") ||
    //     hasPermission("createRolePermission") ||
    //     hasPermission("viewRolePermission") ||
    //     hasPermission("updateRolePermission") ||
    //     hasPermission("deleteRolePermission") ||
    //     hasPermission("createDesignation") ||
    //     hasPermission("viewDesignation") ||
    //     hasPermission("updateDesignation") ||
    //     hasPermission("deleteDesignation")) && {
    //     label: "HR",
    //     key: "hrSection",
    //     icon: <UserOutlined />,
    //     children: [
    //       {
    //         label: (
    //           <NavLink to="/hr/staffs">
    //             <span>Personnel</span>
    //           </NavLink>
    //         ),
    //         key: "staffs",
    //         icon: <UsergroupAddOutlined />
    //       },
    //       {
    //         label: (
    //           <NavLink to="/role">
    //             <span>Rôle et autorisations</span>
    //           </NavLink>
    //         ),
    //         key: "roleAndPermissions",
    //         icon: <UserSwitchOutlined />
    //       },
    //       {
    //         label: (
    //           <NavLink to="/designation/">
    //             <span>Fonction</span>
    //           </NavLink>
    //         ),
    //         key: "designation",
    //         icon: <UserSwitchOutlined />
    //       }
    //     ]
    //   },
    !isProRole &&
      (hasPermission("updateSetting") || hasPermission("viewSetting")) && {
        label: "PARAMÈTRES",
        key: "settings",
        icon: <SettingOutlined />,
        children: [
          {
            label: (
              <NavLink to="/supplier">
                <span>Fournisseurs</span>
              </NavLink>
            ),
            key: "MSC",
            icon: <UserOutlined />
          },
          {
            label: (
              <NavLink to="/allAuditLogs">
                <span>All Logs</span>
              </NavLink>
            ),
            key: "MSC",
            icon: <FolderAddOutlined />
          },
          {
            label: (
              <NavLink to="/product-category">
                <span>Catégorie de Produits</span>
              </NavLink>
            ),
            key: "MSC",
            icon: <FolderAddOutlined />
          },
          {
            label: (
              <NavLink to="/invoice-setting">
                <span>Paramètres de facturation</span>
              </NavLink>
            ),
            key: "MSC",
            icon: <SettingOutlined />,
          }
        ]
      },

    isProRole &&
      hasPermission("createSaleInvoice") && {
        label: (
          <NavLink to="/pos">
            <span>Boutique</span>
          </NavLink>
        ),
        key: "MSC",
        icon: <ShoppingCartOutlined />
      },
    isProRole &&
      hasPermission("viewSaleInvoice") && {
        label: (
          <NavLink to="/salelist">
            <span>Liste des Achats</span>
          </NavLink>
        ),
        key: "MV",
        icon: <UnorderedListOutlined />
      },

      !isProRole &&
      hasPermission("viewDashboard") && {
        label: (
          <NavLink to="/dashboardsms">
            <span>TABLEAU DE BORD</span>
          </NavLink>
        ),
        key: "MV",
        icon: <HomeOutlined />
      },
    
    !isProRole &&
      (hasPermission("createSaleInvoice") ||
        hasPermission("viewSaleInvoice") ||
        hasPermission("updateSaleInvoice") ||
        hasPermission("deleteSaleInvoice")) && {
        label: "VENTE",
        key: "saleSection",
        icon: <MinusSquareOutlined />,
        children: [
          
          hasPermission("viewSaleInvoice") && {
            label: (
              <NavLink to="/salelist">
                <span>Liste de vente</span>
              </NavLink>
            ),
            key: "MV",
            icon: <UnorderedListOutlined />
          },
          {
            label: (
              <NavLink to="/sale">
                <span>Centre Thérapeutique</span>
              </NavLink>
            ),
            key: "MV",
            icon: <CheckOutlined />
          },
          hasPermission("createSaleInvoice") && {
            label: (
              <NavLink to="/pos">
                <span>Boutique</span>
              </NavLink>
            ),
            key: "MV",
            icon: <ShoppingCartOutlined />
          }
          
        ]
      },
      {
        label: (
          <NavLink to={pdfFile} target="_blank">
            AIDE
          </NavLink>
        ),
        key: "MV",
        icon: <QuestionCircleOutlined />,
      },
  

      hasPermission("ReadDashboardHR") && 
    {
			label: (
				<NavLink to='/admin/dashboardrh'>
					<span>Tableau de bord</span>
				</NavLink>
			),
			key: "MR",
			icon: <HomeOutlined />,
		},

		(hasPermission("create-user") ||
			hasPermission("readAll-user") ||
			hasPermission("readAll-role") ||
			hasPermission("readAll-designation") ||
			hasPermission("readAll-department")) && {
			label: "RH",
      key: "hr",
			icon: <UserOutlined />,
			children: [
				hasPermission("create-user") && {
					label: (
						<NavLink to='/admin/hr/staffs/new'>
							<span>Nouvel employé</span>
						</NavLink>
					),

          key: "MR",
					icon: <UsergroupAddOutlined />,
				},
				hasPermission("create-user") && {
					label: (
					<Tooltip title="Liste des employés" >
						<NavLink to='/admin/hr/staffs'>
							
							<span>Liste des employés</span>
							
						</NavLink>
					</Tooltip>
					),
          key: "MR",
					icon: <UsergroupAddOutlined />,
				},
				hasPermission("create-user") && {
					label: (
						<NavLink to='/role'>
							<span>Role & Permissions</span>
						</NavLink>
					),
          key: "MR",
					icon: <UserSwitchOutlined />,
				},
				hasPermission("readAll-department") && {
					label: (
						<NavLink to='/admin/designation/'>
							<span>Poste</span>
						</NavLink>
					),
          key: "MR",
					icon: <UserSwitchOutlined />,
				},
				hasPermission("readAll-department") && {
					label: (
						<NavLink to='/admin/department'>
							<span>Department</span>
						</NavLink>
					),
          key: "MR",
					icon: <UserSwitchOutlined />,
				},
        
			],
		},

		(hasPermission("create-attendance") ||
			hasPermission("readAll-attendance")) && {
			label: "PRÉSENCE",
			key: "attendance",
			icon: <ClockCircleOutlined />,
			children: [
				hasPermission("create-attendance") && {
					label: (
						<NavLink to='/admin/attendance'>
							<span>Présence</span>
						</NavLink>
					),
          key: "MR",
					icon: <FileDoneOutlined />,
				},
				hasPermission("readSingle-attendance") && {
					label: (
						<NavLink to={`/admin/attendance/user/${user}`}>
							<span>Ma présence</span>
						</NavLink>
					),
          key: "MR",
					icon: <FileDoneOutlined />,
				},
			],
		},

		(hasPermission("create-payroll") || hasPermission("readAll-payroll")) && {
			label: "PAIE",
      key: "payroll",
			icon: <WalletOutlined />,
			children: [
				hasPermission("create-payroll") && {
					label: (
						<NavLink to='/admin/payroll/new'>
							<span>Calculer la paie</span>
						</NavLink>
					),
          key: "MR",
					icon: <FileDoneOutlined />,
				},
				hasPermission("readAll-payroll") && {
					label: (
					<Tooltip title="Liste des fiches de paie" >
						<NavLink to='/admin/payroll/list'>
							<span>Liste des fiches de paie</span>
						</NavLink>
					</Tooltip>
					),
          key: "MR",
					icon: <FileOutlined />,
				},
			],
		},

		hasPermission("readAll-employmentStatus") && {
			label: (
				<Tooltip title="STATUT DE L'EMPLOI">
					
						<span>STATUT DE L'EMPLOI</span>
					
				</Tooltip>
				),
        key: "employementStatus",
			
			icon: <RocketOutlined />,
			children: [
				hasPermission("readAll-employmentStatus") && {
					label: (
						<Tooltip title="Statut d'emploi">
						  <NavLink to='/admin/employment-status'>
							<span>Statut d'emploi</span>
						  </NavLink>
					</Tooltip>
					),
          key: "MR",
					icon: <FileDoneOutlined />,
				},
			],
		},

		(hasPermission("create-leaveApplication") ||
			hasPermission("readAll-leaveApplication") ||
			hasPermission("readSingle-leaveApplication")) && {
			label: "CONGÉS",
			key: "leave",
			icon: <UsergroupDeleteOutlined />,
			children: [
				hasPermission("create-leaveApplication") && {
					label: (
						<NavLink to='/admin/leave/new'>
							<span> Nouveau congé </span>
						</NavLink>
					),
          key: "MR",
					icon: <SubnodeOutlined />,
				},
				hasPermission("readAll-leaveApplication") && {
					label: (
						<NavLink to='/admin/leave'>
							<span>Statut de congé</span>
						</NavLink>
					),
          key: "MR",
					icon: <FileDoneOutlined />,
				},
				hasPermission("readSingle-leaveApplication") && {
					label: (
						<NavLink to={`/admin/leave/user/${user}`}>
							<span>Mon congé</span>
						</NavLink>
					),
          key: "MR",
					icon: <FileDoneOutlined />,
				},
			],
		},

		hasPermission("readAll-announcement") && {
			label: "ANNONCE",
      key: "announcement",
			icon: <NotificationFilled />,
			children: [
				hasPermission("readAll-announcement") && {
					label: (
						<NavLink to='/admin/announcement'>
							<span>Annonce</span>
						</NavLink>
					),
          key: "MR",
					icon: <FlagFilled />,
				},
			],
		},

		(hasPermission("crate-award") || hasPermission("readAll-award")) && {
			label: "PRIX",
      key: "award",
			icon: <TrophyFilled />,
			children: [
				hasPermission("create-award") && {
					label: (
						<NavLink to='/admin/award/new'>
							<span>Nouveau prix</span>
						</NavLink>
					),
          key: "MR",
					icon: <TrophyFilled />,
				},

				hasPermission("readAll-award") && {
					label: (
						<NavLink to='/admin/award'>
							<span>Prix</span>
						</NavLink>
					),
          key: "MR",
					icon: <TrophyFilled />,
				},
			],
		},

		(hasPermission("create-project") ||
			hasPermission("readAll-project") ||
			hasPermission("create-projectTeam") ||
			hasPermission("create-milestone") ||
			hasPermission("readAll-priority") ||
			hasPermission("create-task-Status")) && {
			label: "PROJET",
			key: "project",
			icon: <SettingOutlined />,
			children: [
				hasPermission("create-project") && {
					label: (
						<NavLink to='/admin/project/new'>
							<span>Ajouter un projet</span>
						</NavLink>
					),
          key: "MR",
					icon: <SettingOutlined />,
				},
				hasPermission("readAll-project") && {
					label: (
						<NavLink to='/admin/project'>
							<span>Liste des projets</span>
						</NavLink>
					),
          key: "MR",
					icon: <SettingOutlined />,
				},
				hasPermission("create-projectTeam") && {
					label: (
						<NavLink to='/admin/team'>
							<span>Équipe</span>
						</NavLink>
					),
          key: "MR",
					icon: <SettingOutlined />,
				},
				(hasPermission("create-priority") ||
					hasPermission("readAll-priority")) && {
					label: (
						<NavLink to='/admin/task-priority'>
							<span>Priorité des tâches</span>
						</NavLink>
					),
          key: "MR",
					icon: <SettingOutlined />,
				},
				hasPermission("create-milestone") && {
					label: (
						<NavLink to='/admin/milestone'>
							<span>Ajouter un jalon</span>
						</NavLink>
					),
          key: "MR",
					icon: <SettingOutlined />,
				},

				hasPermission("create-taskStatus") && {
					label: (
						<Tooltip title="Ajouter le statut d'une tâche">
						<NavLink to='/admin/task-status'>
							<span>Ajouter le statut d'une tâche</span>
						</NavLink>
						</Tooltip>
					),
					key: "MR",
					icon: <SettingOutlined />,
				},
			],
		},

		// hasPermission("readAll-setting") && {
		// 	label: "PARAMÈTRES",
		// 	key: "settings",
		// 	icon: <SettingOutlined />,
		// 	children: [
		// 		hasPermission("readAll-setting") && {
		// 			label: (
		// 				<Tooltip title="Paramètres de l'entreprise">
		// 				<NavLink to='/admin/company-setting'>
		// 					<span>Paramètres de l'entreprise</span>
		// 				</NavLink>
		// 				</Tooltip>
		// 			),
    //       key: "MR",
		// 			icon: <SettingOutlined />,
		// 		},
		// 	],
		// },
		{
			label: (
			  <NavLink to={pdfFile} target="_blank">
				AIDE
			  </NavLink>
			),
      key: "MR",
			icon: <QuestionCircleOutlined />
		},
	
  ];

  return (
    <div>
      <center>
        <a href="/dashboard" onClick={() => handleModuleClick('Global')}>
        <img
          src={logo}
          alt="logo"
          style={{
            width: "50%",
            height: "50%",
            objectFit: "cover"
          }}
        />
        </a>
        <h3
          style={{
            width: "100%",
            height: "100%",
            color: "white",
            marginTop: "7%",
            objectFit: "cover"
          }}
        >
          <b>{isProRole ? "saï i lama shop" : "ERP"}</b>
        </h3>

        <Menu
          theme="dark"
          mode="vertical"
          items={getMenuItems()}
          className="sidenav-menu"
          onClick={({ key }) => handleModuleClick(key)}
          // style={{ backgroundColor: "transparent" }}
        />
      </center>
    </div>
  );
};

export default Test;

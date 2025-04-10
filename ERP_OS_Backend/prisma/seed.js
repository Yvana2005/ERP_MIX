const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const saltRounds = 10;



const permissions = [
  "createProduct",
  "viewProduct",
  "updateProduct",
  "deleteProduct",

  // "createCustomer",
  "viewCustomer",
  "updateCustomer",
  "deleteCustomer",

  "createSupplier",
  "viewSupplier",
  "updateSupplier",
  "deleteSupplier",

  "createTransaction",
  "viewTransaction",
  "updateTransaction",
  "deleteTransaction",

  "createSaleInvoice",
  "viewSaleInvoice",
  "updateSaleInvoice",
  "deleteSaleInvoice",
  "chekSaleInvoice",

  "createPurchaseInvoice",
  "viewPurchaseInvoice",
  "updatePurchaseInvoice",
  "deletePurchaseInvoice",

  "createPaymentPurchaseInvoice",
  "viewPaymentPurchaseInvoice",
  "updatePaymentPurchaseInvoice",
  "deletePaymentPurchaseInvoice",

  "createPaymentSaleInvoice",
  "viewPaymentSaleInvoice",
  "updatePaymentSaleInvoice",
  "deletePaymentSaleInvoice",

  "createRole",
  "viewRole",
  "updateRole",
  "deleteRole",

  "createRolePermission",
  "viewRolePermission",
  "updateRolePermission",
  "deleteRolePermission",

  "create-user",
  "viewUser",
  "updateUser",
  "deleteUser",
  "professionalUser",
  "viewDashboard",
  "readAll-dashboard",

  "viewPermission",

  "createDesignation",
  "viewDesignation",
  "updateDesignation",
  "deleteDesignation",
  "readAll-designation",

  "createProductCategory",
  "viewProductCategory",
  "updateProductCategory",
  "deleteProductCategory",

  "createReturnPurchaseInvoice",
  "viewReturnPurchaseInvoice",
  "updateReturnPurchaseInvoice",
  "deleteReturnPurchaseInvoice",

  "createReturnSaleInvoice",
  "viewReturnSaleInvoice",
  "updateReturnSaleInvoice",
  "deleteReturnSaleInvoice",

  "ReadDashboardHR",

  "create-assignedTask",
  "readAll-assignedTask",
  "readSingle-assignedTask",
  "update-assignedTask",
  "delete-assignedTask",

  "create-award",
  "readAll-award",
  "update-award",
  "delete-award",
  "readSingle-award",

  "create-awardHistory",
  "readAll-awardHistory",
  "readSingle-awardHistory",
  "update-awardHistory",
  "delete-awardHistory",

  "CreateFile",
  "ViewFile",
  "UpdateFile",
  "DeleteFile",


  "create-weeklyHoliday",
  "readAll-weeklyHoliday",
  "readSingle-weeklyHoliday",
  "update-weeklyHoliday",
  "delete-weeklyHoliday",

  "create-publicHoliday",
  "readAll-publicHoliday",
  "readSingle-publicHoliday",
  "update-publicHoliday",
  "delete-publicHoliday",

  "create-project",
  "readAll-project",
  "readSingle-project",
  "update-project",
  "delete-project",

  "create-task",
  "readAll-task",
  "readSingle-task",
  "update-task",
  "delete-task",

  "create-projectTeam",
  "readAll-projectTeam",
  "readSingle-projectTeam",
  "update-projectTeam",
  "delete-projectTeam",

  "CreateTaskDependency",
  "ViewTaskDependency",
  "UpdateTaskDependency",
  "DeleteTaskDependency",

  "create-taskStatus",
  "readAll-taskStatus",
  "readSingle-taskStatus",
  "update-taskStatus",
  "delete-taskStatus",

  "CreateTaskTime",
  "ViewTaskTime",
  "UpdateTaskTime",
  "DeleteTaskTime",

  "create-priority",
  "readAll-priority",
  "readSingle-priority",
  "update-priority",
  "delete-priority",

  "CreateAccount",
  "ViewAccount",
  "UpdateAccount",
  "DeleteAccount",
  "readAll-account",
  "readSingle-account",
  "update-accoun",

  "CreateAttendance",
  "ViewAttendance",
  "UpdateAttendance",
  "DeleteAttendance",
  "getAllAttendance",
  "getSingleAttendance",
  "getAttendanceByUserId",
  "getLastAttendanceByUserId",
  "readAll-attendance",
  "readSingle-attendance",
  "create-attendance",

  "create-department",
  "readAll-department",
  "update-department",
  "delete-department",
  "readSingle-department",

  "create-education",
  "readAll-education",
  "update-education",
  "delete-education",
  "readSingle-education",

  "create-payroll",
  "readAll-payroll",
  "readSingle-payroll",
  "update-payroll",

  "update-leaveApplication",
  "create-leaveApplication",
  "readAll-leaveApplication",
  "readSingle-leaveApplication",
  "readByUserId-leaveApplication",

  "create-employmentStatus",
  "readAll-employmentStatus",
  "readSingle-employmentStatus",
  "delete-employmentStatus",
  "update-employmentStatus",

  "create-announcement",
  "readAll-announcement",
  "readSingle-announcement",
  "update-announcement",
  "delete-announcement",

  "CreateSalaryHistory",
  "ViewSalaryHistory",
  "UpdateSalaryHistory",
  "DeleteSalaryHistory",
  "create-salaryHistory",
  "update-salaryHistory",

  "create-designationHistory",
  "readAll-designationHistory",
  "readSingle-designationHistory",
  "update-designationHistory",
  "delete-designationHistory",

  "CreateEmail",
  "ViewEmail",
  "UpdateEmail",
  "DeleteEmail",

  "create-milestone",
  "readAll-milestone",
  "readSingle-milestone",
  "update-milestone",
  "delete-milestone",

  "readAll-Report",
  "delete-Report",
  "readSingle-Report",

  "updateSetting",
  "viewSetting",
];

const roles = ["admin", "staff", "Professionnel", "Particulier"];

const accounts = [
  { name: "Asset", type: "Asset" },
  { name: "Liability", type: "Liability" },
  { name: "Capital", type: "Owner's Equity" },
  { name: "Withdrawal", type: "Owner's Equity" },
  { name: "Revenue", type: "Owner's Equity" },
  { name: "Expense", type: "Owner's Equity" },
];

const subAccounts = [
  { account_id: 1, name: "Cash" }, //1
  { account_id: 1, name: "Bank" }, //2
  { account_id: 1, name: "Inventory" }, //3
  { account_id: 1, name: "Accounts Receivable" }, //4
  { account_id: 2, name: "Accounts Payable" }, //5
  { account_id: 3, name: "Capital" }, //6
  { account_id: 4, name: "Withdrawal" }, //7
  { account_id: 5, name: "Sales" }, //8
  { account_id: 6, name: "Cost of Sales" }, //9
  { account_id: 6, name: "Salary" }, //10
  { account_id: 6, name: "Rent" }, //11
  { account_id: 6, name: "Utilities" }, //12
  { account_id: 5, name: "Discount Earned" }, //13
  { account_id: 6, name: "Discount Given" }, //14
];

const settings = {
  company_name: "saï i lama",
  address: "Etoa Meki",
  phone: "693972665",
  email: "contact@saiilama.com",
  website: "My Website",
  footer: "©2025 saï i lama",
  tag_line: "Le bien-être est notre prédilection",
};

const department = [
  { name: "IT" },
  { name: "HR" },
  { name: "Marketing" },
  { name: "Customer Support" },
  { name: "Soin" },
  { name: "Sale" },
];

const designation = [
  { name: "Praticien" },
  { name: "Commercial" },
  { name: "Hr Manager" },
];

const employmentStatus = [
  { name: "Mi-Temps", colourValue: "#00FF00", description: "Mi-temps" },
  { name: "Constant", colourValue: "#FF0000", description: "Permenent" },
];

const professionalPermissions = [
  "professionalUser", "viewSaleInvoice", "viewProduct", "viewProductCategory", 
  "viewCustomer", "createSaleInvoice","updateCustomer",
];
const particularPermissions = [
  "professionalUser", "viewSaleInvoice", "viewProduct", "viewProductCategory", 
  "viewCustomer", "createSaleInvoice","updateCustomer"
];

const year = new Date().getFullYear();
const publicHoliday = [
  {
    name: "Nouvelle Année",
    date: new Date(year, 0, 1)
  },
  {
    name: "Fête Nationale",
    date: new Date(year, 5, 20)
  },
  {
    name: "Noël",
    date: new Date(year, 11, 25)
  }
];

const award = [
  {
    name: "Employé Le plus Vendeur",
    description: "Employé qui a le plus vendu au cours du mois"
  },
  {
    name: "Employé le plus apprécié",
    description: "Employé qui a obtenu de bons avis des client/hote au cours du mois"
  }
];

const priority = [
  {
    name: "Faible",
  },
  {
    name: "Moyen",
  },
  {
    name: "Fort",
  },
];

async function main() {
  await prisma.department.createMany({
    data: department,
  });
  await prisma.designation.createMany({
    data: designation,
  });
  await prisma.employmentStatus.createMany({
    data: employmentStatus,
  });
  
  await prisma.publicHoliday.createMany({
    data: publicHoliday,
  });

  await prisma.award.createMany({
    data: award,
  });

  await prisma.priority.createMany({
    data: priority,
  });

  // await prisma.role.createMany({
  //   data: roles.map((role) => {
  //     return {
  //       name: role,
  //     };
  //   }),
  // });
  // await prisma.permission.createMany({
  //   data: permissions.map((permission) => {
  //     return {
  //       name: permission,
  //     };
  //   }),
  // });
  // for (let i = 1; i <= permissions.length; i++) {
  //   await prisma.rolePermission.create({
  //     data: {
  //       role: {
  //         connect: {
  //           id: 1,
  //         },
  //       },
  //       permission: {
  //         connect: {
  //           id: i,
  //         },
  //       },
  //     },
  //   });
  // }
  
  const adminHash = await bcrypt.hash("admin", saltRounds);
  const staffHash = await bcrypt.hash("staff", saltRounds);
  
  // Check if admin user exists
  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@gmail.com" }
  });

  if (!adminUser) {
    await prisma.user.create({
      data: {
        username: "admin",
        firstName: "admin",
        lastName: "admin",
        email: "admin@gmail.com",
        password: adminHash,
        employmentStatusId: 1,
        departmentId: 1,
        role: "admin",
        gender:"Homme"
      },
    });
  }

  // Check if staff user exists
  const staffUser = await prisma.user.findUnique({
    where: { email: "staff@gmail.com" }
  });

  if (!staffUser) {
    await prisma.user.create({
      data: {
        username: "staff",
        firstName: "staff",
        lastName: "staff",
        email: "staff@gmail.com",
        password: staffHash,
        employmentStatusId: 1,
        departmentId: 1,
        role: "staff",
        gender:"Homme"
      },
    });
  }

 // Check and insert permissions
  for (const permission of permissions) {
    const existingPermission = await prisma.permission.findUnique({
      where: { name: permission }
    });
    if (!existingPermission) {
      await prisma.permission.create({
        data: { name: permission }
      });
    }
  }

  // Check and insert roles
  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role }
    });
    if (!existingRole) {
      await prisma.role.create({
        data: { name: role }
      });
    }
  }
  

  // Assign permissions to the admin role
  const adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
  if (adminRole) {
    for (const permission of permissions) {
      const existingRolePermission = await prisma.rolePermission.findUnique({
        where: {
          role_id_permission_id: {
            role_id: adminRole.id,
            permission_id: (await prisma.permission.findUnique({ where: { name: permission } })).id
          }
        }
      });
      if (!existingRolePermission) {
        await prisma.rolePermission.create({
          data: {
            role_id: adminRole.id,
            permission_id: (await prisma.permission.findUnique({ where: { name: permission } })).id
          }
        });
      }
    }
  }

  // Assign specific permissions to the professional role
  const professionalRole = await prisma.role.findUnique({ where: { name: "Professionnel" } });
  if (professionalRole) {
    for (const permission of professionalPermissions) {
      const permissionId = (await prisma.permission.findUnique({ where: { name: permission } })).id;
      const existingRolePermission = await prisma.rolePermission.findUnique({
        where: {
          role_id_permission_id: {
            role_id: professionalRole.id,
            permission_id: permissionId
          }
        }
      });
      if (!existingRolePermission) {
        await prisma.rolePermission.create({
          data: {
            role_id: professionalRole.id,
            permission_id: permissionId
          }
        });
      }
    }
  }


   // Assign specific permissions to the professional role
   const particularRole = await prisma.role.findUnique({ where: { name: "Particulier" } });
   if (particularRole) {
     for (const permission of particularPermissions) {
       const permissionId = (await prisma.permission.findUnique({ where: { name: permission } })).id;
       const existingRolePermission = await prisma.rolePermission.findUnique({
         where: {
           role_id_permission_id: {
             role_id: particularRole.id,
             permission_id: permissionId
           }
         }
       });
       if (!existingRolePermission) {
         await prisma.rolePermission.create({
           data: {
             role_id: particularRole.id,
             permission_id: permissionId
           }
         });
       }
     }
   }

  // Check and insert accounts
  for (const account of accounts) {
    const existingAccount = await prisma.account.findUnique({
      where: { name: account.name }
    });
    if (!existingAccount) {
      await prisma.account.create({
        data: account
      });
    }
  }

  // Check and insert subAccounts
  for (const subAccount of subAccounts) {
    const existingSubAccount = await prisma.subAccount.findUnique({
      where: { name: subAccount.name }
    });
    if (!existingSubAccount) {
      await prisma.subAccount.create({
        data: subAccount
      });
    }
  }

  // Check and insert settings
  const existingSetting = await prisma.appSetting.findFirst({
    where: { company_name: settings.company_name }
  });
  if (!existingSetting) {
    await prisma.appSetting.create({
      data: settings
    });
  }

  

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

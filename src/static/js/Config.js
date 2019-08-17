var CONFIG = {
    Status: {
        CREATE_SUCC: 0,  // 新建
        MODIFY_SUCC: 1,  // 修改
        AUDIT_SUCC: 2,   // 审批
        INBOUND_SUCC: 3, // 入库
        DELETE_SUCC: 4,  // 移库

        CREATE_FAIL: 10,
        MODIFY_FAIL: 11,
        AUDIT_FAIL: 12,
        INBOND_FAIL: 13,
        DELETE_FAIL: 14
    },

    UserType: {
        admin : "admin", // 系统管理员
        manager : "manager", // 审计经理
        dataEntry : "dataentry", // 录入员
        kbAdmin : "kbAdmin" // 知识库管理员
    }
}

export {
    CONFIG
}
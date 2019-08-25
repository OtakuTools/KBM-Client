var CONFIG = {
    Status: {
        CREATE_SUCC: 0,  // 新建
        SUBMIT_SUCC: 1,  // 提交申请
        MODIFY_SUCC: 2,  // 修改
        AUDIT_SUCC: 3,   // 审批
        INBOUND_SUCC: 4, // 入库
        DELETE_SUCC: 5,  // 移库

        CREATE_FAIL: 10,
        SUBMIT_FAIL: 11,
        MODIFY_FAIL: 12,
        AUDIT_FAIL: 13,
        INBOND_FAIL: 14,
        DELETE_FAIL: 15
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
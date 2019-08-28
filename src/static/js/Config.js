var CONFIG = {
    Status: {
        CREATE_SUCC: 0,  // 新建
        MODIFY_SUCC: 1,  // 修改
        SUBMIT_SUCC: 2,  // 提交申请
        AUDIT_SUCC: 3,   // 审批
        INBOUND_SUCC: 4, // 入库
        MOVE_SUB_SUCC: 5,  // 移库申请
        MOVE_AUD_SUCC: 6,  // 移库审核
        MOVE_SUCC: 7,  // 移库完成

        CREATE_FAIL: 10,
        MODIFY_FAIL: 11,
        SUBMIT_FAIL: 12,
        AUDIT_FAIL: 13,
        INBOND_FAIL: 14,
        MOVE_SUB_FAIL: 15,
        MOVE_AUD_FAIL: 16,
        MOVE_FAIL: 17,
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
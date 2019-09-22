<template>
  <el-card>
    <el-container>
      <el-main style="min-width: 1070px;">
          <el-row>
            <el-col :span="20" :offset="2">
              <el-form :model="knowledgeForm" ref="knowledgeForm" label-position="left" label-width="120px" :rules="rules" style="min-width: 1070px;">
                <el-form-item label="知识编号" prop="sequence" >
                  <el-input v-model="knowledgeForm.sequence" placeholder="请输入知识编号" readonly></el-input>
                </el-form-item>
                <el-form-item label="申请人部门" prop="department">
                  <el-input v-model="knowledgeForm.department" placeholder="请输入申请人部门" readonly></el-input>
                </el-form-item>
                <el-form-item label="申请人姓名" prop="applicant">
                  <el-input v-model="knowledgeForm.applicant" placeholder="请输入申请人姓名" readonly></el-input>
                </el-form-item>
                <el-form-item label="知识类别" prop="knowledgeType" style="text-align: left;">
                  <el-radio-group v-model="knowledgeForm.knowledgeType">
                    <el-radio-button label="基础环境"></el-radio-button>
                    <el-radio-button label="网络设备"></el-radio-button>
                    <el-radio-button label="主机设备"></el-radio-button>
                    <el-radio-button label="存储设备"></el-radio-button>
                    <el-radio-button label="桌面设备"></el-radio-button>
                    <el-radio-button label="安全设备"></el-radio-button>
                    <el-radio-button label="基础软件"></el-radio-button>
                    <el-radio-button label="支撑软件"></el-radio-button>
                    <el-radio-button label="应用软件"></el-radio-button>
                    <el-radio-button label="其他"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="问题发现时间" prop="discoverTime">
                  <el-date-picker v-model="knowledgeForm.discoverTime" type="date" style="width: 100%;" placeholder="请输入问题发现时间" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="问题解决时间" prop="resolveTime">
                  <el-date-picker v-model="knowledgeForm.resolveTime" type="date" style="width: 100%;" placeholder="请输入问题解决时间" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="问题持续时间" prop="lastfor">
                  <el-input v-model="knowledgeForm.lastfor" placeholder="请输入问题持续时间"></el-input>
                </el-form-item>
                <el-form-item label="知识条目标题" prop="kTitle">
                  <el-input v-model="knowledgeForm.kTitle" placeholder="请输入知识条目标题"></el-input>
                </el-form-item>
                <el-form-item label="内容描述" prop="kContent">
                  <el-input v-model="knowledgeForm.kContent" placeholder="请输入内容描述"></el-input>
                </el-form-item>
                <el-form-item label="解决方法" prop="kMethod">
                  <el-input v-model="knowledgeForm.kMethod" placeholder="请输入解决方法"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row v-if="knowledgeForm.curStatus == 0 || knowledgeForm.curStatus == 1 || knowledgeForm.curStatus >= 10">
            <el-col :span="20" :offset="2" v-if="userType == 0">
              <el-button type="success" @click="create('knowledgeForm')">{{canSubmit? "保存修改":"保存" }}</el-button>
              <el-button type="warning" @click="submit('knowledgeForm')" :disabled="!canSubmit" v-if="canSubmit">提交审核</el-button>
              <el-button type="danger" @click="clear('knowledgeForm')">取消</el-button>
              <el-button type="primary" @click="back('knowledgeForm')">返回</el-button>
            </el-col>
            <el-col :span="20" :offset="2" v-else>
              <el-button type="primary" @click="back('knowledgeForm')">返回</el-button>
            </el-col>
          </el-row>
          <el-row v-else-if="knowledgeForm.curStatus == 2 || knowledgeForm.curStatus == 3 || knowledgeForm.curStatus == 5 || knowledgeForm.curStatus == 6">
            <el-col :span="20" :offset="2" v-if="userType == 0">
              <el-button type="primary" @click="back('knowledgeForm')">返回</el-button>
            </el-col>
            <el-col :span="20" :offset="2" v-else>
              <el-button type="success" @click="Agree">同意</el-button>
              <el-button type="danger" @click="Disagree">不同意</el-button>
              <el-button type="primary" @click="back('knowledgeForm')">返回</el-button>
            </el-col>
          </el-row>
          <el-row v-else-if="knowledgeForm.curStatus == 4">
            <el-col :span="20" :offset="2" v-if="userType == 0">
              <el-button type="success" @click="MoveDB()">提交移库申请</el-button>
              <el-button type="primary" @click="back('knowledgeForm')">返回</el-button>
            </el-col>
            <el-col :span="20" :offset="2" v-else>
              <el-button type="primary" @click="back('knowledgeForm')">返回</el-button>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="20" :offset="2">
              <el-button type="primary" @click="back('knowledgeForm')">返回</el-button>
            </el-col>
          </el-row>
      </el-main>
    </el-container>
  </el-card>
</template>

<style scoped>
.el-form-item {
  margin-bottom: calc(5vh);
  height: 11%;
}
</style>

<script>
import {CONFIG} from './../static/js/Config'
export default {
  name: 'comp_draftInfo',
  data () {
    return {
      knowledgeForm: {
        'sequence': '',
        'department': '',
        'applicant': '',
        'knowledgeType': '',
        'discoverTime': '',
        'resolveTime': '',
        'lastfor': '',
        'kTitle': '',
        'kContent': '',
        'kMethod': '',
        'curStatus': 0
      },

      rules: {
        sequence: [
          { required: true, message: '', trigger: 'blur' },
        ],
        department: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
        ],
        applicant: [
          { required: true, message: '请输入申请人', trigger: 'blur' },
        ],
        knowledgeType: [
          { required: true, message: '请输入知识类别', trigger: 'blur' },
        ],
        discoverTime: [
          { required: true, message: '请输入问题发现时间', trigger: 'blur' },
        ],
        resolveTime: [
          { required: true, message: '请输入问题解决时间', trigger: 'blur' },
        ],
        lastfor: [
          { required: true, message: '请输入问题持续时间', trigger: 'blur' },
        ],
        kTitle: [
          { required: true, message: '请输入知识条目标题', trigger: 'blur' },
        ],
        kContent: [
          { required: true, message: '请输入内容描述', trigger: 'blur' },
        ],
        kMethod: [
          { required: true, message: '请输入解决方法', trigger: 'blur' },
        ]
      },

      userType: 0,
      websocket: null,
      canSubmit: false
    }
  },

  created() {
    if (this.$route.query.type) {
      if (this.$route.query.type == CONFIG.UserType.dataEntry) {
        this.userType = 0;
      } else {
        this.userType = 1;
      }
    }
    
    //默认使用当前用户名的realname，若已有知识条目则会被覆盖
    this.axios.get(`api/info/getUser?token=${this.$cookies.get("token")}`).then(
      (res) => {
        this.knowledgeForm["applicant"] = res.data.data[0]["realname"];
        this.knowledgeForm["department"] = res.data.data[0]["department"];
        console.log(res.data.data[0]);
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    );
    
    if (this.$route.query.sequence) {
      this.canSubmit = true;
      this.axios.get(`api/info/getInfo?token=${this.$cookies.get("token")}&sequence=${this.$route.query.sequence}`).then(
        (res) => {
          let response = res.data;
          console.log(response);
          if (!response.errorCode) {
            this.knowledgeForm = response.data[0];
          } else {
            this.$message({
              message: response.msg,
              type: "error"
            });
          }
        }
      ).catch(
        (error) => {
          this.$message({
            message: error,
            type: "error"
          });
        }
      );
    } else if (this.$cookies.isKey("new_seq") && this.$cookies.get("new_seq") != "") {
      this.knowledgeForm.sequence = this.$cookies.get("new_seq");
    } else {
      console.log("a");
      this.axios.get(`api/info/getSeq?token=${this.$cookies.get("token")}`).then(
        (res) => {
          let response = res.data;
          if (!response.errorCode) {
            this.knowledgeForm.sequence = `ZSK${response.data.day.split('-').map(e => e.length < 2? "0" + e : e).join('')}${response.data.seq}`;
            this.$cookies.set("new_seq", this.knowledgeForm.sequence);
          } else {
            this.$message({
              message: response.msg,
              type: "error"
            });
          }
        }
      ).catch(
        (error) => {
          this.$message({
            message: error,
            type: "error"
          });
        }
      );
    };
  },

  mounted() {

    if (typeof(WebSocket) === "undefined"){
      this.$message({
        message: "该浏览器不支持WebSocket",
        type: "error"
      });
    } else {
      this.websocket = new WebSocket(CONFIG.WS.url);
      this.websocket.onopen = (event) => {
        console.log('websocket connected');
      };

      this.websocket.onmessage = (event) => {
        
      };

      this.websocket.onclose = (event) => {
        console.log("WebSocket is closed now.");
      };

      this.websocket.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };
    }
  },

  destroyed () {
      // 销毁监听
      this.websocket.close();
  },

  methods:{
    sendMessage(info) {
      if (this.websocket && typeof this.websocket.send === 'function') {
        this.websocket.send(JSON.stringify(info));
      }
    },

    create(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.knowledgeForm);
          data["author"] = this.$cookies.get("token").split("_")[1];
          if (data.curStatus > 10) {
            data.curStatus = CONFIG.Status.MODIFY_SUCC;
          }
          this.axios.post(`api/info/${this.$route.query.sequence? "modify" : "add"}?token=${this.$cookies.get("token")}`, data).then(
            (res) => {
              let response = res.data;
              if (!response.errorCode) {
                this.$cookies.remove("new_seq");
                this.sendMessage({
                  type: 1,
                  event: "create info"
                });
                this.$router.push({
                  name: "listAll"
                });
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            },
          ).catch(
            (error) => {
              this.$message({
                message: error,
                type: "error"
              });
            }
          )
          return true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.knowledgeForm);
          data["author"] = this.$cookies.get("token").split("_")[1];
          data.curStatus = CONFIG.Status.SUBMIT_SUCC;
          this.axios.post(`api/info/${this.$route.query.sequence? "modify" : "add"}?token=${this.$cookies.get("token")}`, data).then(
            (res) => {
              let response = res.data;
              if (!response.errorCode) {
                this.sendMessage({
                  type: 1,
                  event: "submit info"
                });
                this.$router.push({
                  name: "listAll"
                });
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            },
          ).catch(
            (error) => {
              this.$message({
                message: error,
                type: "error"
              });
            }
          )
          return true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    clear(formName) {
      let seq = this.knowledgeForm.sequence;
      this.$refs[formName].resetFields();
      this.knowledgeForm.sequence = seq;
    },

    back(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({
        name: "listAll"
      });
    },

    Agree() {
      var [type, name, t] = this.$cookies.get('token').split('_');
      if (type == CONFIG.UserType.manager) {
        if (this.knowledgeForm.curStatus == CONFIG.Status.SUBMIT_SUCC || this.knowledgeForm.curStatus == CONFIG.Status.MOVE_SUB_SUCC) {
          var data = {
            sequence: this.knowledgeForm.sequence,
            curStatus: CONFIG.Status.AUDIT_SUCC,
            auditor: name
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.sendMessage({
                  type: 1,
                  event: "agree audit"
                });
                this.$router.push({
                  name: "listAll"
                });
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            }
          ).catch(
            (error) => {
              this.$message({
                  message: error,
                  type: "error"
                });
            }
          );
        } else {
          this.$message({
            message: "无需操作或不符合操作条件",
            type: "warning"
          });
        }
      } else if (type == CONFIG.UserType.kbAdmin) {
        if (this.knowledgeForm.curStatus == CONFIG.Status.AUDIT_SUCC || this.knowledgeForm.curStatus == CONFIG.Status.MOVE_AUD_SUCC) {
          var data = {
            sequence: this.knowledgeForm.sequence,
            curStatus: CONFIG.Status.INBOUND_SUCC
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.sendMessage({
                  type: 1,
                  event: "agree inbound"
                });
                this.$router.push({
                  name: "listAll"
                });
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            }
          ).catch(
            (error) => {
              this.$message({
                  message: error,
                  type: "error"
                });
            }
          );
        } else {
          this.$message({
            message: "无需操作或不符合操作条件",
            type: "warning"
          });
        }
      }
    },

    Disagree() {
      var [type, name, t] = this.$cookies.get('token').split('_');
      if (type == CONFIG.UserType.manager) {
        if (this.knowledgeForm.curStatus == CONFIG.Status.SUBMIT_SUCC || this.knowledgeForm.curStatus == CONFIG.Status.MOVE_SUB_SUCC) {
          this.$prompt( '修改意见' , '审核确认' , {confirmButtonText: '确定',cancelButtonText: '取消'} ).then(({ value }) => {
            var data = {
              sequence: this.knowledgeForm.sequence,
              curStatus: CONFIG.Status.AUDIT_FAIL,
              auditor: name,
              opinion: value
            };
            console.log(data)
            this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
              (res) => {
                var response = res.data;
                if (!response.errorCode) {
                  this.sendMessage({
                    type: 1,
                    event: "disagree audit"
                  });
                  this.$router.push({
                    name: "listAll"
                  });
                } else {
                  this.$message({
                    message: response.msg,
                    type: "error"
                  });
                }
              }
            ).catch(
              (error) => {
                this.$message({
                    message: error,
                    type: "error"
                  });
              }
            );
          }).catch() 
        } else {
          this.$message({
            message: "无需操作或不符合操作条件",
            type: "warning"
          });
        }
      } else if (type == CONFIG.UserType.kbAdmin) {
        if (this.knowledgeForm.curStatus == CONFIG.Status.AUDIT_SUCC || this.knowledgeForm.curStatus == CONFIG.Status.MOVE_AUD_SUCC) {
          var data = {
            sequence: this.knowledgeForm.sequence,
            curStatus: CONFIG.Status.INBOND_FAIL
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.sendMessage({
                  type: 1,
                  event: "disagree inbound"
                });
                this.$router.push({
                  name: "listAll"
                });
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            }
          ).catch(
            (error) => {
              this.$message({
                  message: error,
                  type: "error"
                });
            }
          );
        } else {
          this.$message({
            message: "无需操作或不符合操作条件",
            type: "warning"
          });
        }
      }
    },

    MoveDB() {
      var [type, name, t] = this.$cookies.get('token').split('_');
      var data = {
        sequence: this.knowledgeForm.sequence,
        curStatus: CONFIG.Status.MOVE_SUB_SUCC,
        auditor: name
      }
      this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
        (res) => {
          var response = res.data;
          if (!response.errorCode) {
            this.sendMessage({
              type: 1,
              event: "move db"
            });
            this.$router.push({
              name: "listAll"
            });
          } else {
            this.$message({
              message: response.msg,
              type: "error"
            });
          }
        }
      ).catch(
        (error) => {
          this.$message({
              message: error,
              type: "error"
            });
        }
      );
    },
  }
  
}
</script>

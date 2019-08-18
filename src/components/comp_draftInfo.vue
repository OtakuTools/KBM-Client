<template>
  <div>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form :model="knowledgeForm" label-position="left" label-width="100px">
              <el-form-item label="知识编号">
                <el-input v-model="knowledgeForm.sequence" placeholder="请输入知识编号" readonly></el-input>
              </el-form-item>
              <el-form-item label="申请人部门">
                <el-input v-model="knowledgeForm.department" placeholder="请输入申请人部门"></el-input>
              </el-form-item>
              <el-form-item label="申请人姓名">
                <el-input v-model="knowledgeForm.applicant" placeholder="请输入申请人姓名"></el-input>
              </el-form-item>
              <el-form-item label="知识类别">
                <el-input v-model="knowledgeForm.knowledgeType" placeholder="请输入知识类别"></el-input>
              </el-form-item>
              <el-form-item label="问题发现时间">
                <el-input v-model="knowledgeForm.discoverTime" placeholder="请输入问题发现时间"></el-input>
              </el-form-item>
              <el-form-item label="问题解决时间">
                <el-input v-model="knowledgeForm.resolveTime" placeholder="请输入问题解决时间"></el-input>
              </el-form-item>
              <el-form-item label="问题持续时间">
                <el-input v-model="knowledgeForm.lastfor" placeholder="请输入问题持续时间"></el-input>
              </el-form-item>
              <el-form-item label="知识条目标题">
                <el-input v-model="knowledgeForm.kTitle" placeholder="请输入知识条目标题"></el-input>
              </el-form-item>
              <el-form-item label="内容描述">
                <el-input v-model="knowledgeForm.kContent" placeholder="请输入内容描述"></el-input>
              </el-form-item>
              <el-form-item label="解决方法">
                <el-input v-model="knowledgeForm.kMethod" placeholder="请输入解决方法"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2" v-if="userType == 0">
            <el-button type="success" @click="submit">保存</el-button>
            <el-button type="danger" @click="clear">取消</el-button>
          </el-col>
          <el-col :span="20" :offset="2" v-else>
            <el-button type="success" @click="Agree">同意</el-button>
            <el-button type="danger" @click="Disagree">不同意</el-button>
          </el-col>
        </el-row>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

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
      userType: 0
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
    if (this.$route.query.sequence) {
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
    } else {
      this.axios.get(`api/info/getSeq?token=${this.$cookies.get("token")}`).then(
        (res) => {
          let response = res.data;
          console.log(response);
          if (!response.errorCode) {
            this.knowledgeForm.sequence = `ZSK${response.data.day.split('-').join('')}${response.data.seq}`;
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
    }
  },

  methods:{
    submit() {
      let data = Object.assign({}, this.knowledgeForm);
      if (data.curStatus > 10) {
        data.curStatus = CONFIG.Status.MODIFY_SUCC;
      }
      this.axios.post(`api/info/${this.$route.query.sequence? "modify" : "add"}?token=${this.$cookies.get("token")}`, data).then(
        (res) => {
          let response = res.data;
          console.log(response);
          if (!response.errorCode) {
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
    },

    clear() {
      console.log("attempt to clear")
    },

    Agree() {

    },

    Disagree() {

    }
  }
  
}
</script>

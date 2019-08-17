<template>
  <div>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-button type="success" @click="submit" v-text="greenName"></el-button>
        <el-button type="danger" @click="clear" v-text="redName"></el-button>
        <el-form :model="knowledgeForm">
          <el-form-item label="知识编号">
            <el-input v-model="knowledgeForm.sequence" placeholder="请输入知识编号"></el-input>
          </el-form-item>
          <el-form-item label="申请人部门">
            <el-input v-model="knowledgeForm.department" placeholder="请输入申请人部门"></el-input>
          </el-form-item>
          <el-form-item label="申请人姓名">
            <el-input v-model="knowledgeForm.applicant" placeholder="请输入申请人姓名"></el-input>
          </el-form-item>
          <el-form-item label="知识类别">
            <el-input v-model="knowledgeForm.knowledgetype" placeholder="请输入知识类别"></el-input>
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
        <el-button type="success" @click="submit" v-text="greenName"></el-button>
        <el-button type="danger" @click="clear" v-text="redName"></el-button>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'comp_draftInfo',
  data () {
    return {
      knowledgeForm: {
        'sequence': '',
        'department': '',
        'applicant': '',
        'knowledgetype': '',
        'discoverTime': '',
        'resolveTime': '',
        'lastfor': '',
        'kTitle': '',
        'kContent': '',
        'kMethod': ''
      },
      greenName:(this.$cookies.get("token").slice(0,9)=="dataentry")?"you are dataentry":"you are admin",
      redName:"放弃",
    }
  },
  created() {
    console.log(this.$route.query.sequence);
  },
  methods:{
    submit() {
      console.log(this.$cookies.get("token"));
      /*
      this.axios.post("api/info/add?token=".concat(this.$cookies.get("token")), this.knowledgeForm).then(
        (res) => { 
          console.log(res.data);
        },
      ).catch(
        (err) => { console.log(err); }
      )
      */
    },
    clear() {
      console.log("attempt to clear")
    }
  }
  
}
</script>

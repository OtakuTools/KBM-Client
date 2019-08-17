<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table ref="filterTable" :data="tableData" style="width: 100%" stripe>
          <el-table-column prop="sequence" label="知识编号" sortable></el-table-column>
          <el-table-column prop="department" label="申请人部门" :filters="departments" :filter-method="filterHandler">
            <template slot-scope="scope">
              <el-tag effect="dark" style="width: 50%;">
                {{scope.row.department}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applicant" label="申请人姓名" sortable></el-table-column>
          <el-table-column prop="kTitle" label="知识条目标题"></el-table-column>
          <el-table-column prop="tag" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-more" @click="More(scope.row)" circle></el-button>
              <el-button type="success" icon="el-icon-check" @click="Agree(scope.row)" circle></el-button>
              <el-button type="danger" icon="el-icon-close" @click="Disagree(scope.row)" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // tableData: [{
      //   sequence: 'ZSK20190801001',
      //   department: '总经理',
      //   applicant: '王小一',
      //   knowledgetype: '知',
      //   discoverTime: '20190801',
      //   resolveTime: '20190807',
      //   lastfor: '6',
      //   kTitle: '文本生成至 28% 出错',
      //   kContent: '文本生成至 28% 出错',
      //   kMethod: 'ignore'
      // }, {
      //   sequence: 'ZSK20190801002',
      //   department: '管理者代表',
      //   applicant: '孙小二',
      //   knowledgetype: '识',
      //   discoverTime: '20190801',
      //   resolveTime: '20190802',
      //   lastfor: '1',
      //   kTitle: '文本生成至 27% 出错',
      //   kContent: '文本生成至 27% 出错',
      //   kMethod: 'ignore'
      // }, {
      //   sequence: 'ZSK20190801003',
      //   department: '残部',
      //   applicant: '赵三',
      //   knowledgetype: '类',
      //   discoverTime: '20190801',
      //   resolveTime: '20190803',
      //   lastfor: '2',
      //   kTitle: '文本生成至 26% 出错',
      //   kContent: '文本生成至 26% 出错',
      //   kMethod: 'ignore',
      // }, {
      //   sequence: 'ZSK20190801004',
      //   department: '战略忽悠部',
      //   applicant: '辛77',
      //   knowledgetype: '别',
      //   discoverTime: '20190801',
      //   resolveTime: '20190803',
      //   lastfor: '2',
      //   kTitle: '文本生成至 25% 出错',
      //   kContent: '文本生成至 25% 出错',
      //   kMethod: 'ignore'
      // }],
      // departments: [{text: '战略忽悠部', value: '战略忽悠部'},{text: '残部', value: '残部'},{text: 'aaa', value: 'aaa'}]
      tableData : [],
      departments : []
    }
  },

  created() {
    this.axios.get(`api/info/search?token=${this.$cookies.get('token')}&page=1&pageSize=10`).then(
      (res) => {
        let response = res.data;
        this.tableData = [];
        this.department = [];
        if (!response.errorCode) {
          let deps = [];
          for (var item in this.tableData) {
            deps.append({
              text: item.department,
              value: item.department
            })
          }
          this.tableData = response.data.content;
          this.departments = deps;
        } else {
          this.$message(response.msg);
        }
      }
    ).catch(
      (err) => {
        this.$message(err);
      }
    );
  },

  methods: {
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },

    More(row) {
      console.log(row.sequence);
      var seq = row.sequence;
      this.$router.push({ 
        name: 'draft', 
        query: { 
          sequence: seq
        }
      });
    },

    Agree(row) {
      console.log(row);
    },

    Disagree(row) {
      console.log(row);
    }
  }
}
</script>
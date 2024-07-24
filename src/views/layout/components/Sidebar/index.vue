<template>
  <div class="gradient-background">

    <el-scrollbar wrap-class="scrollbar-wrapper" >
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        style="background-color: transparent"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        class="transparent-bg"
      >
        <sidebar-item :menu="menu" :is-collapse="isCollapse" class="transparent-bg"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import SidebarItem from './SidebarItem'
import {validatenull} from '@/utils/validate'
import {initMenu, setUrlPath} from '@/utils/util'

export default {
  components: {SidebarItem},
  created() {
    if (validatenull(this.menu)) {
      this.$store.dispatch('GetMenu').then(data => {
        initMenu(this.$router, data)
      })
    }
  },
  computed: {
    ...mapGetters(['menu', 'tag', 'isCollapse']),
    nowTagValue: function () {
      return setUrlPath(this.$route)
    }
  }
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(180deg, #618fe9, #6b9fdb, #73b1d6, #91dec7);
  height: 100%; /* 确保背景覆盖整个菜单 */
  position: relative;
  z-index: -10;
}

.transparent-bg{
  background-color: transparent !important;
}


</style>

<template>
  <div class="menu-wrapper">
    <template v-for="(item, index) in menu" class="custom-menu-item">
      <el-menu-item v-if="item.children.length===0 " :index="filterPath(item.path,index)" :key="item.label" @click="open(item)" class="custom-menu-item">
        <svg-icon :icon-class="item.icon" style="color: #f5f1f1"/>
        <span slot="title"  style="color: #f5f1f1">{{ item.label }}</span>
      </el-menu-item>

      <el-submenu v-else :index="filterPath(item.label,index)" :key="item.label" class="custom-menu-item">
        <template slot="title">
          <svg-icon :icon-class="item.icon" style="color: #f5f1f1"/>
          <span slot="title" :class="{'el-menu--display':isCollapse}"  style="color: #f5f1f1">{{ item.label }}</span>
        </template>
        <template v-for="(child,cindex) in item.children" class="custom-menu-item">
          <el-menu-item v-if="child.children.length==0" :index="filterPath(child.path,cindex)" :key="cindex" @click="open(child)" class="menu-wrapper bg-gradient padding-bottom">
            <span slot="title" style="color: #f5f1f1" >{{ child.label }}</span>
          </el-menu-item>
          <sidebar-item v-else :menu="[child]" :key="cindex" :is-collapse="isCollapse"/>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import Item from './Item'
import { resolveUrlPath } from '@/utils/util'

export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    menu: {
      type: Array
    },
    isCollapse: {
      type: Boolean
    }
  },
  data() {
    return {}
  },
  methods: {
    filterPath(path, index) {
      return path == null ? index + '' : path
    },
    open(item) {
      this.$router.push({
        path: resolveUrlPath(item.path, item.label),
        query: item.query
      })
    }
  }
}
</script>

<style scoped>



.bg-gradient{
  background: linear-gradient(100deg, #72aed7, #72aed7);
}

.bg-gradient:hover{
   background: black !important;
 }

.padding-bottom{
  padding-bottom: 4em;
}

.el-menu-item:hover{
  background: #9eccff;
}

/*  zzz：对应网页上的  .el-submenu__title:hover  */
.el-submenu /deep/ .el-submenu__title:hover {
  background: #9eccff !important;
}

/deep/ .el-menu-item:hover {
  background: #9eccff !important;
}
/deep/ .el-menu-item:focus {
   background: #9eccff !important;
 }



</style>

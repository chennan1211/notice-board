<template>
  <NoticeBoard :isAdmin="admin" />
</template>

<script>
import NoticeBoard from "./components/NoticeBoard.vue";
export default {
  name: "App",
  components: {
    NoticeBoard
  },
  computed: {
    admin() {
      return (
        this.$route.params.username === "admin" &&
        this.$route.params.password === "123456"
      );
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

<template>
  <div class="hello">
    <header>
      <div class="notices-header"></div>
      <div>
        <p class="header-name">成都商报营销策划有限公司招标信息网</p>
      </div>
    </header>
    <div class="main-content">
      <div class="notices-content" :class="{ hide: isHide }">
        <div class="main-header">
          <span>最新公告</span>
          <!-- <input class="search-input" placeholder="搜索" /> -->
          <b-input
            class="search-input"
            v-model="searchText"
            placeholder="搜索..."
            type="search"
            icon="magnify"
          ></b-input>
          <b-button
            type="is-primary is-light"
            class="add-button"
            :class="{hide: !isAdmin}"
            @click="openNoticeModal()"
            size="is-small"
          >添加公告</b-button>
        </div>

        <ul class="notice-list">
          <li class="item" v-for="notice in displayNotices" :key="notice.id">
            <a @click="openNotice(notice)" class="left notice-title">{{notice.title}}</a>

            <b-icon
              :class="{ hide: !isAdmin }"
              class="right"
              @click.native.stop="deleteNotice(notice, true)"
              icon="delete"
            ></b-icon>
            <b-icon
              :class="{ hide: !isAdmin }"
              class="right"
              style="margin: 0px 10px;"
              @click.native.stop="openNoticeModal(notice, true)"
              icon="square-edit-outline"
            ></b-icon>
            <span class="right">{{notice.time}}</span>
          </li>
          <li class="item" v-if="displayNotices.length === 0">暂时无公告</li>
        </ul>

        <b-modal v-model="isNoticeModalActive">
          <template #default="props">
            <notice-modal-form
              @close="props.close"
              @publish="publish"
              :isEdit="isEdit"
              :notice="currentNoticeInModal"
            ></notice-modal-form>
          </template>
        </b-modal>
      </div>

      <div class="context" v-bind:class="{ hide: !isHide }">
        <b-button size="is-small" @click="toggle()">返回列表</b-button>
        <div class="title">{{context.title}}</div>
        <div class="time">发布日期：{{context.time}}</div>
        <div class="text w-e-text">
          <p v-html="context.text"></p>
        </div>
      </div>
    </div>

    <footer class="notices-footer">
      <p class>
        <span class="logo"></span>
      </p>
      <p class>成都商报营销策划有限公司招标信息网</p>
    </footer>
  </div>
</template>

<script>
import { NoticeModalForm } from "./ModalForms";
import moment from "moment";
import axios from "axios";
export default {
  name: "NoticeBoard",
  components: {
    NoticeModalForm
  },
  props: ["isAdmin"],
  data: function() {
    return {
      context: {
        title: "",
        time: "",
        text: ""
      },
      isHide: false,
      isloginModalActive: false,
      isNoticeModalActive: false,
      currentNoticeInModal: {},
      isEdit: false,
      notices: [],
      searchText: ""
    };
  },
  created() {
    axios
      .get("/notice")
      .then(response => {
        this.notices = response.data.notices;
      })
      .catch(() => {
        this.$buefy.toast.open({
          duration: 1000,
          message: "获取数据失败！",
          type: "is-danger"
        });
      });
  },

  computed: {
    displayNotices: function() {
      return this.notices
        .filter(
          notice =>
            notice.title.indexOf(this.searchText) !== -1 ||
            notice.time.indexOf(this.searchText) !== -1
        )
        .sort(({ time: a }, { time: b }) => {
          if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          return 0;
        });
    }
  },
  methods: {
    openNotice(item) {
      this.isHide = true;
      this.context = item;
    },
    toggle() {
      this.isHide = !this.isHide;
    },
    openNoticeModal(
      notice = { title: "", text: "", time: moment().format("YYYY-MM-DD") },
      isEdit = false
    ) {
      this.isEdit = isEdit;
      this.isNoticeModalActive = true;
      this.currentNoticeInModal = notice;
    },
    async publish(notice) {
      if (this.isEdit) {
        await this.deleteNotice(this.currentNoticeInModal);
      }
      axios
        .post("/notice", {
          ...notice,
          time: moment(notice.time).format("YYYY-MM-DD")
        })
        .then(response => {
          this.$buefy.toast.open({
            duration: 1000,
            message: "发布成功！",
            type: "is-success"
          });
          this.notices = response.data.notices;
        })
        .catch(() => {
          this.$buefy.toast.open({
            duration: 1000,
            message: "发布失败！",
            type: "is-danger"
          });
        });
    },
    async deleteNotice(notice, fromAction = false) {
      await axios
        .delete("/notice", { data: { id: notice.id } })
        .then(response => {
          if (fromAction) {
            this.$buefy.toast.open({
              duration: 1000,
              message: "删除成功！",
              type: "is-success"
            });
            this.notices = response.data.notices;
          }
        })
        .catch(() => {
          if (fromAction) {
            this.$buefy.toast.open({
              duration: 1000,
              message: "删除失败！",
              type: "is-danger"
            });
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.main-header {
  position: relative;
  text-align: left;
  font-size: 1.5rem;
  color: #4169e1;
  height: 60px;
  line-height: 60px;
  border: #ddd 1px solid;
  border-radius: 4px;
  margin: 10px 0;
  padding: 0 10px;
}

.search-input {
  display: inline-block;
  top: 7px;
  left: 11px;
}

h3 {
  text-align: left;
  border-bottom: 1px solid;
}

.hello {
  height: 100%;
}

.main-content {
  height: calc(100vh - 160px);
  width: 80%;
  left: 10%;
  position: relative;
}

.notices-content .notice-list {
  height: calc(100vh - 310px);
  overflow-y: scroll;
  list-style-type: disc;
  border: #ddd 1px solid;
  border-radius: 4px;
  padding: 10px;
}

.notices-content {
  height: 100%;
}

.item {
  width: 100%;
  height: 40px;
  display: inline-block;
  border-bottom: #ddd 1px dashed;
  font-size: 13px;
  line-height: 40px;
}

.item .icon {
  position: relative;
  top: 12px;
}

.left {
  float: left;
}

.right {
  float: right;
}

.hide {
  display: none !important;
}

.title {
  font-size: 20px;
  line-height: 38px;
  color: #333333;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0 !important;
}

.time {
  text-align: center;
  font-size: 0.75rem;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-top: 10px;
  margin-bottom: 30px;
}

.text {
  font-size: 0.9rem;
  text-indent: 20px;
}

.notices-header {
  background-image: url(../assets/logo.png);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: contain;
  height: 100px;
  width: 100%;
}

.notices-header a {
  color: #fff;
}

a {
  text-decoration: underline;
}

.notices-footer {
  height: 60px;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #333;
  border-top: 1px solid #ddd;
  font-size: 10px;
  background-color: #576173;
  text-align: center;
  padding-top: 10px;
}
.notices-footer span {
  color: #999999;
}
.modal-close.is-large {
  display: none !important;
}
textarea {
  min-height: 20em !important;
}
.add-button {
  position: absolute !important;
  right: 10px;
  top: 12px;
}
.notice-title {
  text-decoration: none;
  color: #333;
}
.notice-title:hover {
  text-decoration: underline;
}
.header-name {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  padding-top: 10px;
  border-bottom: #ddd 1px dashed;
}
.notices-footer .logo {
  background-image: url(../assets/logo.png);
  background-repeat: no-repeat;
  background-size: cover;
  height: 21px;
  width: 185px;
  position: relative;
  top: 5px;
  display: inline-block;
  left: -3px;
}
.context {
  margin-top: 10px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  overflow: scroll;
  height: calc(100vh - 240px);
}
.dropdown-menu {
  z-index: 10002 !important;
}
.notices-content .modal-content {
  text-align: left !important;
}
</style>

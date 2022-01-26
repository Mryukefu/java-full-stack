<template>
  <div class="page-component page-component-comments">
    <div class="page-component-comments-header">
      <template v-if="!showPublishComment">
        <span class="page-component-comments-header-txt">精选留言</span>
        <span class="page-component-comments-header-publish" @click="openPublishCommentDialog">发布留言</span>
      </template>

      <template v-else>
        <span class="page-component-comments-header-txt">输入留言：</span>
        <span class="page-component-comments-header-publish" @click="closePublishCommentDialog">取消</span>
      </template>
    </div>

    <div v-if="showPublishComment && publishUrl !== ''" class="page-component-comments-input">
      <textarea v-model="publishComment.content" cols="30" rows="10"></textarea>
      <a class="page-component-comments-input-button" @click="handlePublishComment">发布留言</a>
    </div>

    <ul class="page-component-comments-list">
      <li v-for="comment in commentsList" class="page-component-comments-list-item">
        <img class="page-component-comments-list-item-avatar" :src="comment.avatar" :alt="comment.username">
        <div class="content-wrapper">
          <div class="content-wrapper-rect"></div>
          <div class="content-wrapper-txt">
          <div class="page-component-comments-list-item-time">{{ comment.time }}</div>
          <div class="page-component-comments-list-item-username">{{ comment.username }}</div>
          <div class="page-component-comments-list-item-content">{{ comment.content }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {getCommentsList, publishAComment} from '../../api/comment'
import auth from '../../utils/auth'
export default {
  props: {
    getListUrl: {
      default: '', 
      required: true,
      type: String
    },
    publishUrl: {
      default: '', 
      type: String
    },
    params: {
      default: () => {}, 
      type: Object
    },
    user: {
      default: () => {}, 
      type: Object
    }
  },
  data() {
    return {
      commentsList: [],
      showPublishComment: true,
      publishComment: {
        // id: "",
        uid: "",
        username: "",
        avatar: '',
        cid: "",
        content: '',
        timestamp: ""
      }
    }
  },
  mounted() {
    let loginUser = auth.getCurrentUser()
    if (loginUser) {
      this.publishComment = {
        ...this.publishComment,
        ...loginUser
      }
    }
    
    this.getCommentsList()
  },
  methods: {
    getCommentsList() {
      getCommentsList(this.params).then(res => {
        this.commentsList = res.data.data
      }).catch(err => {
        console.error(err)
      })
    },
    openPublishCommentDialog() {
      this.showPublishComment = true;
    },
    closePublishCommentDialog() {
      this.showPublishComment = false;
    },
    handlePublishComment() {
      if (!auth.getCurrentUser()) {
        alert('请先登录')
        return;
      }
      this.publishComment.id = Date.now().toString();
      this.publishComment.timestamp = Date.now().toString();
      this.publishComment.cid = Date.now().toString();
      publishAComment(this.publishComment).then(res => {
        if (res.data.code === 10000) {
          alert("发布成功！")
          this.publishComment.content = ''
          this.getCommentsList()
        } else {
          alert(res.data.message)
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-component {
  max-width: 820px;
  margin: 0 auto;
  // 评论组件
  &-comments {
    margin-top: 30px;
    border-top: 1px solid #999;
    padding: 8px;
    &-header {
      height: 28px;
      @media (max-width: 500px) {
        font-size: 13px;
      }
      &-txt {
        color: #999;
      }
      &-publish {
        float: right;
        color: #627efa;
      }
    }
    &-input {
      text-align: center;
      textarea {
        box-sizing: border-box;
        padding: 6px;
        width: 100%;
        resize: none;
        border-radius: 4px;
        color: #aaa;
      }
      &-button {
        display: inline-block;
        margin-top: 4px;
        width: 100px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        box-sizing: border-box;
        font-size: 14px;
        color: #fff;
        background-color: #627efa;
        border-radius: 4px;
        text-decoration: none !important;
        &:active {
          opacity: 0.8;
        }
      }
    }
    &-list {
      padding: 0;
      list-style: none;
      &-item {
        margin-top: 12px;
        .content-wrapper {
          background-color: transparent;
          position: relative;
          z-index: 2;
          width: calc(100% - 78px);
          display: inline-block;
          vertical-align: top;
          $rect-size: 14px;
          &-rect {
            width: $rect-size;
            height: $rect-size;
            position: absolute;
            left: 5px;
            top: 15px;
            z-index: 3;
            transform: rotate(45deg);
          }
          &-txt {
            position: relative;
            z-index: 2;
            width: 100%;
            min-height: 76px;
            display: inline-block;
            margin-left: 12px;
            vertical-align: top;
            border-radius:6px;
            padding: 8px;
          }
          @media (max-width: 500px) {
            width: calc(100% - 63px);
            &-rect {
              width: $rect-size - 4px;
              height: $rect-size - 4px;
              left: 5px;
            }
            &-txt {
              margin-left: 10px;
            }
          }
        }
        &-username {
          $height: 20px;
          height: $height;
          line-height: $height;
          display: inline-block;
          color: #889dfa;
          vertical-align: top;
          font-weight: bold;
        }
        &-avatar {
          $avatar-size: 50px;
          width: $avatar-size;
          height: $avatar-size;
          border-radius: 4px;
          @media (max-width: 500px) {
            width: $avatar-size - 15px;
            height: $avatar-size - 15px;
          }
        }
        &-content {
          padding-top: 6px;
          border-top: 1px solid #666;
          vertical-align: top;
          @media (max-width: 500px) {
            font-size: 13px;
          }
        }
        &-time {
          float: right;
          font-size: 14px;
          color:#aaa;
        }
      }
    }
  }
}
</style>
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Validator from '../../../common/my_validator';
let validator = new Validator();

import {
  login,
  setIsLogin,
} from '../../actions/index';

class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      counter: 60,
      nickname: '',
      phone: '',
      email: '',
      verifyCode: '',
      password: '',
      repassword: '',
      isPhone: true,
      isSendVerifyCode: false,
      avatar: '',
    }
  }

  initQiniu(){
    var _this = this;
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',      // 上传模式,依次退化
        browse_button: 'pickfiles',         // 上传选择的点选按钮，**必需**
        uptoken_url: '/api/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
        get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
        unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
        domain: 'finip',     // bucket 域名，下载资源时用到，**必需**
        container: 'container',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
        max_file_size: '100mb',             // 最大文件体积限制
        flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入 flash,相对路径
        max_retries: 3,                     // 上传失败最大重试次数
        dragdrop: true,                     // 开启可拖曳上传
        drop_element: 'container',          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                  // 分块上传时，每块的体积
        auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
        init: {
            'FilesAdded': (up, files) => {
                plupload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                });
            },
            'BeforeUpload': (up, file) => {
              // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': (up, file) => {
              // 每个文件上传时,处理相关的事情
              this.setState({
                isUploading: true,
                fileName: file.name,
                fileType: file.type,
              });
            },
            'FileUploaded': (up, file, info) => {
              // 每个文件上传成功后,处理相关的事情
              // 其中 info 是文件上传成功后，服务端返回的json，形式如
              // {
              //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
              //    "key": "gogopher.jpg"
              //  }
              // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
              var domain = window.domain;
              var res = JSON.parse(info);
              var sourceLink = domain + res.key; //获取上传成功后的文件的Url
              this.props.setEnterpriseDocument(sourceLink);
              this.setState({
                fileUrl: sourceLink,
                isUploading: false
              });
            },
            'Error': (up, err, errTip) => {
                   //上传出错时,处理相关的事情
            },
            'UploadComplete': () => {
                   //队列文件处理完毕后,处理相关的事情
            },
        }
    });
  }

  setAvatar(){
    let avatar = this.refs.avatar.value;
    this.setState({avatar});
  }

  setVerifyCode(){
    let verifyCode = this.refs.verifyCode.value;
    this.setState({verifyCode});
  }

  setIsSendVerifyCode(val){
    this.setState({isSendVerifyCode:val});
  }

  setNickname(){
    let nickname = this.refs.nickname.value;
    this.setState({nickname});
  }

  setPhone(e){
    this.removeErrorMessage(e.target.id);
    let phone = this.refs.phone.value;
    this.setState({phone});
  }

  setIsPhone(val){
    this.setState({isPhone: val});
  }

  setEmail(e){
    this.removeErrorMessage(e.target.id);
    let email = this.refs.email.value;
    this.setState({email});
  }

  setPassword(e){
    this.removeErrorMessage(e.target.id);
    let password = this.refs.password.value;
    this.setState({password});
  }

  setRepassword(e){
    this.removeErrorMessage(e.target.id);
    let repassword = this.refs.repassword.value;
    this.setState({repassword});
  }

  setIsLogin(val){
    this.props.setIsLogin(val);
  }

  fetchVerifyCode(){

  }

  removeErrorMessage(id){
    validator.removeValidate($('#' + id));
  }

  onBlur(e){
    validator.validate($('#' + e.target.id), e.target.dataset.myValidatorName, this.props.locale);
  }

  signup(e){
    if (validator.isValidForm($('#signup'))){
      let {
        username,
        password,
      } = this.state;
      this.props.signup(username, password);
    }
    e.preventDefault();
  }

  render() {
    let {
      locale,
    } = this.props;
    let {
      counter,
      nickname,
      phone,
      email,
      password,
      repassword,
      isPhone,
      verifyCode,
      isSendVerifyCode,
      avatar,
    } = this.state;
    let LANG_USER = require('../../../../../locales/' + locale + '/user');
    let usernameHtml;
    let methodHtml;
    if (isPhone){
      usernameHtml = (
        <div className="input-group" style={{'width':'75%'}}>
          <span className="input-title">{LANG_USER['phone']}</span>
          <input
            type="text"
            id="phone"
            ref="phone"
            className="form-control input-sm"
            value={phone}
            data-my-validator="true"
            data-my-validator-required="true"
            data-my-validator-name=""
            data-my-validator-type="text"
            placeholder={LANG_USER.phone}
            onBlur={this.onBlur.bind(this)}
            style={{'float':'none','display':'inline-block'}}
            onChange={this.setPhone.bind(this)}
          />
        </div>
      );
      methodHtml = (
        <div className="verify-method" onClick={this.setIsPhone.bind(this, false)}>{LANG_USER['use']}{LANG_USER['email']}</div>
      );
    }
    else{
      usernameHtml = (
        <div className="input-group" style={{'width':'75%'}}>
          <span className="input-title">{LANG_USER['email']}</span>
          <input
            type="text"
            id="email"
            ref="email"
            className="form-control input-sm"
            value={email}
            data-my-validator="true"
            data-my-validator-required="true"
            data-my-validator-name=""
            data-my-validator-type="text"
            placeholder={LANG_USER.email}
            onBlur={this.onBlur.bind(this)}
            style={{'float':'none','display':'inline-block'}}
            onChange={this.setEmail.bind(this)}
          />
        </div>
      );
      methodHtml = (
        <div className="verify-method" onClick={this.setIsPhone.bind(this, true)}>{LANG_USER['use']}{LANG_USER['phone']}</div>
      );
    }
    return(
      <div className="modal-content">
        <div className="modal-header">
          <span className="modal-title" id="exampleModalLabel">{LANG_USER.signup}</span>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form className="signup" id="signup" onSubmit={this.signup.bind(this)}>
            <div className="input-wapper">
              <div className="row-wrapper">
                <div className="input-group width-100pc">
                  <span className="input-title">{LANG_USER['nickname']}</span>
                  <input
                    type="text"
                    id="nickname"
                    ref="nickname"
                    className="form-control input-sm"
                    value={nickname}
                    data-my-validator="true"
                    data-my-validator-required="true"
                    data-my-validator-name=""
                    data-my-validator-type="text"
                    placeholder={LANG_USER.nickname}
                    onBlur={this.onBlur.bind(this)}
                    style={{'float':'none','display':'inline-block'}}
                    onChange={this.setNickname.bind(this)}
                  />
                </div>
              </div>
              <div className="row-wrapper">
                {usernameHtml}
                {methodHtml}
              </div>
              <div className="row-wrapper">
                <div className="input-group" style={{'width':'48%'}}>
                  <span className="input-title">{LANG_USER['verify-code']}</span>
                  <input
                    type="text"
                    id="verify-code"
                    ref="verify-code"
                    className="form-control input-sm"
                    value={verifyCode}
                    data-my-validator="true"
                    data-my-validator-required="true"
                    data-my-validator-name=""
                    data-my-validator-length="6"
                    data-my-validator-type="number"
                    onBlur={this.onBlur.bind(this)}
                    style={{'float':'none','display':'inline-block'}}
                    onChange={this.setVerifyCode.bind(this)}
                  />
                </div>
                <div className={!isSendVerifyCode ? `fetch-verify-code my-button my-button--gray-border` : `fetch-verify-code my-button my-button--gray-border disabled`} onClick={!isSendVerifyCode ? this.fetchVerifyCode.bind(this) : ``}><div className="spin-loader" id="verify-code-spin-loader"></div>{!isSendVerifyCode ? `发送验证码` : `${counter}s后重新发送`}</div>
              </div>
              <div className="row-wrapper">
                <div className="input-group width-100pc">
                  <span className="input-title">{LANG_USER['password']}</span>
                  <input
                    type="password"
                    id="password"
                    ref="password"
                    className="form-control input-sm"

                    data-my-validator="true"
                    data-my-validator-required="true"
                    data-my-validator-name=""
                    data-my-validator-min-length="6"
                    data-my-validator-max-length="20"
                    data-my-validator-type="password"
                    placeholder={LANG_USER.password}
                    onBlur={this.onBlur.bind(this)}
                    style={{'float':'none','display':'inline-block'}}
                    onChange={this.setPassword.bind(this)}
                  />
                </div>
              </div>
              <div className="row-wrapper">
                <div className="input-group width-100pc">
                  <span className="input-title">{LANG_USER['repeat-password']}</span>
                  <input
                    type="password"
                    id="repassword"
                    ref="repassword"
                    className="form-control input-sm"
                    data-my-validator="true"
                    data-my-validator-required="true"
                    data-my-validator-name={LANG_USER['password']}
                    data-my-validator-min-length="6"
                    data-my-validator-max-length="20"
                    data-my-validator-type="password"
                    placeholder={LANG_USER.password}
                    onBlur={this.onBlur.bind(this)}
                    data-my-validator-compare-id="password"
                    style={{'float':'none','display':'inline-block'}}
                    onChange={this.setRepassword.bind(this)}
                  />
                </div>
              </div>
            </div>
            <input type="submit" className="hidden"/>
          </form>
        </div>
        <div className="modal-footer">
          <div className="my-button my-button--red width-100pc" onClick={this.signup.bind(this)}>{LANG_USER.signup}</div>
          <div className="height-15"></div>
          <div className="border-h"></div>
          <div className="height-15"></div>
          <div className="my-button my-button--blue width-100pc" onClick={this.setIsLogin.bind(this, true)}>{LANG_USER.login}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    locale,
  } = state;
  return {
    locale,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    login: (username, password) => {
      dispatch(login(username, password));
    },
    setIsLogin: (val) => {
      dispatch(setIsLogin(val));
    },
  };
}

Signup.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Signup.propTypes = {
  locale: React.PropTypes.string.isRequired,
  login: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
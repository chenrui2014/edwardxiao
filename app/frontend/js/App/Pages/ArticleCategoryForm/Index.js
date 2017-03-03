import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import TinyMCE from 'react-tinymce';
import {
  setIsNotFound,
} from '../../actions/index';

import Validator from '../../../common/my_validator';
let validator = new Validator();

import Utils from '../../../common/utils';

import MobileNav from '../../components/MobileNav/Index';
import Nav from '../../components/Nav/Index';
import Footer from '../../components/Footer/Index';
import NotFound from '../NotFound/Index';
import '../../../../css/articles.css';

class ArticleCategoryForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      // backUrl: null,
      id: '',
      title: '',
      uniqueKey: '',
      author: '',
      preface: '',
      desc: '',
      cover: '',
      articleCategory: '',
      sequence: '',
      type: '',
      level: '',
      tag: '',
      isBanned: false,
      isPrivate: false,
      isAdminOnly: false,
      content: '',
      articleCategoryOptions: [],
      isUploading: false,
      isUseUrl: false,
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    if (!_.isNull(this.props.currentUser) && this.props.currentUser.role == 'admin'){
      this.fetchArticleCategoryOptions();
      if (this.props.params.id){
        this.fetchArticleCategory(this.props.params.id);
      }
    }
    else{
      this.props.setIsNotFound(true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isLoading && !this.state.isLoading){
      this.initQiniu();
    }
    if (prevState.id == '' && this.state.id != ''){
      this.setIsLoading(false);
    }
  }

  fetchArticleCategory(id) {
    this.setIsLoading(true);
    Utils.initSpin('spin-loader');
    this.fetchArticleCategoryApi(id).then((res) => {
      if (res.code === 0){
        if (res.data.length){
          let {
            id,
            title,
            uniqueKey,
            author,
            preface,
            desc,
            cover,
            articleCategory,
            sequence,
            type,
            level,
            tag,
            isBanned,
            isPrivate,
            isAdminOnly,
            content,
          } = res.data[0];
          this.setState({
            id: id,
            title: title,
            uniqueKey: uniqueKey,
            author: author,
            preface: preface,
            desc: desc,
            cover: cover,
            articleCategory: articleCategory,
            sequence: sequence,
            type: type,
            level: level,
            tag: tag,
            isBanned: isBanned,
            isPrivate: isPrivate,
            isAdminOnly: isAdminOnly,
            content: content,
          });
        }
        else{
          this.props.setIsNotFound(true);
        }
      }
      else{
        if(res.msg){
          alert(res.msg);
        }
      }
      Utils.stopSpin('spin-loader');
    }).catch((err) => {
      // debugger;
      // alert('网络错误，请重试');
      console.log(err);
      Utils.stopSpin('spin-loader');
    });
  }

  fetchArticleCategoryApi(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/article_categories/' + id,
        type: 'get',
        success: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    })
  }

  initQiniu(){
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',      // 上传模式,依次退化
        browse_button: 'pickfiles',         // 上传选择的点选按钮，**必需**
        uptoken_url: '/api/settings/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
        get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
        unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
        domain: __PRELOADED_STATE__.qiniuDomain,     // bucket 域名，下载资源时用到，**必需**
        container: 'container',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
        max_file_size: '100mb',             // 最大文件体积限制
        flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入 flash,相对路径
        max_retries: 3,                     // 上传失败最大重试次数
        dragdrop: true,                     // 开启可拖曳上传
        drop_element: 'container',          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                  // 分块上传时，每块的体积
        auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
        init: {
            // 'FilesAdded': (up, files) => {
            //     plupload.each(files, function(file) {
            //         // 文件添加进队列后,处理相关的事情
            //     });
            // },
            // 'BeforeUpload': (up, file) => {
            //   // 每个文件上传前,处理相关的事情
            // },
            'UploadProgress': (up, file) => {
              // 每个文件上传时,处理相关的事情
              Utils.initSpin('cover-spin-loader', {
                lines: 9,
                length: 12,
                width: 10,
                radius: 14,
                scale: 0.3,
              });
              this.setState({
                isUploading: true,
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
              var domain = `http://${__PRELOADED_STATE__.qiniuDomain}/`;
              var res = JSON.parse(info);
              var sourceLink = domain + res.key; //获取上传成功后的文件的Url
              this.setState({
                cover: `${sourceLink}`,
                isUploading: false
              });
            },
            // 'Error': (up, err, errTip) => {
            //        //上传出错时,处理相关的事情
            // },
            // 'UploadComplete': () => {
            //        //队列文件处理完毕后,处理相关的事情
            // },
        }
    });
    var uploader2 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',      // 上传模式,依次退化
        browse_button: 'contentFilePicker',         // 上传选择的点选按钮，**必需**
        uptoken_url: '/api/settings/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
        get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
        unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
        domain: __PRELOADED_STATE__.qiniuDomain,     // bucket 域名，下载资源时用到，**必需**
        container: 'contentContainer',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
        max_file_size: '100mb',             // 最大文件体积限制
        flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入 flash,相对路径
        max_retries: 3,                     // 上传失败最大重试次数
        dragdrop: true,                     // 开启可拖曳上传
        drop_element: 'container',          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                  // 分块上传时，每块的体积
        auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
        init: {
          // 'FilesAdded': (up, files) => {
          //   plupload.each(files, function(file) {
          //       // 文件添加进队列后,处理相关的事情
          //   });
          // },
          // 'BeforeUpload': (up, file) => {
          //   // 每个文件上传前,处理相关的事情
          // },
          // 'UploadProgress': (up, file) => {
          //   // 每个文件上传时,处理相关的事情
          // },
          'FileUploaded': (up, file, info) => {
            var domain = `http://${__PRELOADED_STATE__.qiniuDomain}/`;
            var res = JSON.parse(info);
            var sourceLink = domain + res.key; //获取上传成功后的文件的Url
            this.editor.insertContent('<img src="'+ sourceLink +'"/>');
          },
          // 'Error': (up, err, errTip) => {
          //   //上传出错时,处理相关的事情
          // },
          // 'UploadComplete': () => {
          //   //队列文件处理完毕后,处理相关的事情
          // },
        }
    });
  }

  handleImageLoaded() {
    Utils.stopSpin('cover-spin-loader');
  }

  onChange(value) {
    this.setState({content: value});
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(
        value.toString('html')
      );
    }
  }

  removeErrorMessage(id){
    validator.removeValidate($('#' + id));
  }

  onBlur(e){
    validator.validate($('#' + e.target.id), e.target.dataset.myValidatorName, this.props.locale);
  }

  setTitle(e){
    this.removeErrorMessage(e.target.id);
    let title = this.refs.title.value;
    this.setState({title});
  }

  setCover(e){
    this.removeErrorMessage(e.target.id);
    let cover = this.refs.cover.value;
    this.setState({cover});
  }

  setUniqueKey(e){
    this.removeErrorMessage(e.target.id);
    let uniqueKey = this.refs.uniqueKey.value;
    this.setState({uniqueKey});
  }

  setAuthor(e){
    this.removeErrorMessage(e.target.id);
    let author = this.refs.author.value;
    this.setState({author});
  }

  setPreface(e) {
    this.removeErrorMessage(e.target.id);
    let preface = this.refs.preface.value;
    this.setState({preface});
  }

  setDesc(e) {
    this.removeErrorMessage(e.target.id);
    let desc = this.refs.desc.value;
    this.setState({desc});
  }

  setType(e) {
    this.removeErrorMessage(e.target.id);
    let type = this.refs.type.value;
    this.setState({type});
  }

  setLevel(e) {
    this.removeErrorMessage(e.target.id);
    let level = this.refs.level.value;
    this.setState({level});
  }

  setSequence(e) {
    this.removeErrorMessage(e.target.id);
    let sequence = this.refs.sequence.value;
    this.setState({sequence});
  }

  setTag(e) {
    this.removeErrorMessage(e.target.id);
    let tag = this.refs.tag.value;
    this.setState({tag});
  }

  setArticleCategory() {
    let articleCategory = this.refs.articleCategory.value;
    this.setState({articleCategory});
  }

  fetchArticleCategoryOptions() {
    Utils.initSpin('spin-loader');
    this.fetchArticleCategoryOptionsApi().then((res) => {
      if (res.code === 0){
        this.setState({articleCategoryOptions: res.data});
        if (res.data.length){
          if (_.isUndefined(this.props.params.id)){
            this.setState({articleCategory: res.data[0].uniqueKey});
          }
        }
      }
      else{
        if(res.msg){
          alert(res.msg);
        }
      }
      if (!this.props.params.id){
        this.setIsLoading(false);
      }
      Utils.stopSpin('spin-loader');
    }).catch((err) => {
      // debugger;
      // alert('网络错误，请重试');
      console.log(err);
      Utils.stopSpin('spin-loader');
    });
  }

  fetchArticleCategoryOptionsApi() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/article_categories/options',
        type: 'get',
        success: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    })
  }

  submit(e){
    if (validator.isValidForm($('#submit'))){
      let {
        id,
        title,
        uniqueKey,
        author,
        preface,
        desc,
        cover,
        articleCategory,
        sequence,
        type,
        level,
        tag,
        isBanned,
        isPrivate,
        isAdminOnly,
        content,
      } = this.state;
      this.submitForm(id, title, uniqueKey, author, preface, desc, cover, articleCategory, sequence, type, level, tag, isBanned, isPrivate, isAdminOnly, content.toString('html'));
    }
    e.preventDefault();
  }

  submitForm(id, title, uniqueKey, author, preface, desc, cover, articleCategory, sequence, type, level, tag, isBanned, isPrivate, isAdminOnly, content){
    Utils.initSpin('spin-loader');
    this.submitFormApi(id, title, uniqueKey, author, preface, desc, cover, articleCategory, sequence, type, level, tag, isBanned, isPrivate, isAdminOnly, content).then((res) => {
      if (res.code === 0){
        this.context.router.push('/article_categories/' + res.uniqueKey);
      }
      else if (res.code === 2){
        if (!$('#title').parent().siblings('.my-validator-message').length) {
          validator.createMessage($('#title').parent(), res.msg, 'error');
        }
      }
      else if (res.code === 3){
        if (!$('#uniqueKey').parent().siblings('.my-validator-message').length) {
          validator.createMessage($('#uniqueKey').parent(), res.msg, 'error');
        }
      }
      Utils.stopSpin('spin-loader');
    }).catch((err) => {
      // debugger;
      // alert('网络错误，请重试');
      console.log(err);
      Utils.stopSpin('spin-loader');
    });
  }

  submitFormApi(id, title, uniqueKey, author, preface, desc, cover, articleCategory, sequence, type, level, tag, isBanned, isPrivate, isAdminOnly, content){
    let url = '/api/article_categories';
    let method = 'post';
    if (id != ''){
      url = `/api/article_categories/${id}`;
      method = 'put';
    }
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        type: method,
        data: {id, title, uniqueKey, author, preface, desc, cover, articleCategory, sequence, type, level, tag, isBanned, isPrivate, isAdminOnly, content},
        success: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    })
  }

  setIsBanned(val){
    this.setState({isBanned:val});
  }

  setIsPrivate(val){
    this.setState({isPrivate:val});
  }

  setIsAdminOnly(val){
    this.setState({isAdminOnly:val});
  }

  go(url) {
    this.context.router.push(url);
  }

  setIsUseUrl(val){
    this.setState({isUseUrl:val});
  }

  handleEditorChange(e) {
    this.setState({content: e.target.getContent()});
  }

  onCheckChange() {

  }

  render() {
    let contentHtml;
    let {
      locale,
      isNotFound,
    } = this.props;
    let {
      isLoading,
      isUploading,
      // id,
      title,
      uniqueKey,
      author,
      preface,
      desc,
      cover,
      articleCategory,
      sequence,
      type,
      level,
      tag,
      isBanned,
      isPrivate,
      isAdminOnly,
      content,
      articleCategoryOptions,
      isUseUrl,
    } = this.state;
    if (isNotFound){
      contentHtml = (<NotFound />);
    }
    else{
      let LANG_ARTICLE = require('../../../../../locales/' + locale + '/article');
      let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
      let LANG_NAV = require('../../../../../locales/' + locale + '/nav');
      let coverUrlHtml;
      let coverHtml;
      let coverImageHtml;
      let previewClass;
      let cameraHtml = (<div className="camera-mask"><span className="icon icon-camera-alt"></span></div>);
      if (!isUploading && cover != ''){
        // coverImageHtml = (<img className="" src={`${cover}?imageView/1/w/${300}/h/${300}`} style={{'width':'100%'}} onLoad={this.handleImageLoaded.bind(this)}/>);
        coverImageHtml = (<img className="" src={`${cover}`} style={{'width':'100%'}} onLoad={this.handleImageLoaded.bind(this)}/>);
        previewClass = 'preview';
      }
      if (isUseUrl){
        coverUrlHtml = (
          <div className="row-wrapper">
            <div className="title">{LANG_ARTICLE['cover']}</div>
            <div className="input-group width-100pc">
              <input
                type="text"
                id="cover"
                ref="cover"
                className="form-control input-sm"
                value={cover}
                data-my-validator="true"
                data-my-validator-required="false"
                data-my-validator-name=""
                data-my-validator-type="text"
                placeholder={LANG_ARTICLE['cover']}
                onBlur={this.onBlur.bind(this)}
                style={{'float':'none','display':'inline-block'}}
                onChange={this.setCover.bind(this)}
                autoComplete="off"
              />
            </div>
          </div>
        );
      }
      else{
        coverHtml = (
          <div className="cover-picker" id="pickfiles">
            <div className={`cover-holder ${previewClass}`}>
              <div className="spin-loader" id="cover-spin-loader" style={{'zIndex':'999'}}></div>
              {coverImageHtml}
              {cameraHtml}
            </div>
          </div>
        );
      }
      let articleCategoryOptionsHtml;
      if (!isLoading){
        if (articleCategoryOptions.length){
          articleCategoryOptionsHtml = articleCategoryOptions.map((item, key) => {
            return (
              <option key={key} value={item.uniqueKey}>{item.title}</option>
            );
          });
        }
        contentHtml = (
          <div className="page-content article background-white">
            <MobileNav isIndex={false} activeTab="article_categories"/>
            <Nav isIndex={false} activeTab="article_categories"/>
            <div className="core-content background-white">
              <div className="core">
                <div className="my-button my-button--red" onClick={uniqueKey == '' ? this.go.bind(this, '/article_categories/') : this.go.bind(this, '/article_categories/' + uniqueKey)}>{LANG_NAV['back']}</div>
                <form className="submit" id="submit" onSubmit={this.submit.bind(this)} autoComplete="off">
                  <div className="form-check step-content__text mgt-15 mgb-20">
                    <label className="form-check-label fw-reg" style={{'marginBottom':'0'}}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onClick={this.setIsUseUrl.bind(this, !isUseUrl)}
                        checked={isUseUrl}
                        onChange={this.onCheckChange.bind(this)}
                      />
                      &nbsp;<span className="">{`${LANG_ARTICLE['use-image-url']}`}</span>
                    </label>
                  </div>
                  <div id="container" className="cover-container">
                    {coverUrlHtml}
                    {coverHtml}
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_ARTICLE['title']}</div>
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="title"
                        ref="title"
                        className="form-control input-sm"
                        value={title}
                        data-my-validator="true"
                        data-my-validator-required="true"
                        data-my-validator-name=""
                        data-my-validator-type="text"
                        placeholder={LANG_ARTICLE['title']}
                        onBlur={this.onBlur.bind(this)}
                        style={{'float':'none','display':'inline-block'}}
                        onChange={this.setTitle.bind(this)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_ARTICLE['unique-key']}</div>
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="uniqueKey"
                        ref="uniqueKey"
                        className="form-control input-sm"
                        value={uniqueKey}
                        data-my-validator="true"
                        data-my-validator-required="true"
                        data-my-validator-name=""
                        data-my-validator-type="text"
                        placeholder={LANG_ARTICLE['unique-key']}
                        onBlur={this.onBlur.bind(this)}
                        style={{'float':'none','display':'inline-block'}}
                        onChange={this.setUniqueKey.bind(this)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_ARTICLE['author']}</div>
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="author"
                        ref="author"
                        className="form-control input-sm"
                        value={author}
                        data-my-validator="true"
                        data-my-validator-required="true"
                        data-my-validator-name=""
                        data-my-validator-type="text"
                        placeholder={LANG_ARTICLE['author']}
                        onBlur={this.onBlur.bind(this)}
                        style={{'float':'none','display':'inline-block'}}
                        onChange={this.setAuthor.bind(this)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_ARTICLE['preface']}</div>
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="preface"
                        ref="preface"
                        className="form-control input-sm"
                        value={preface}
                        data-my-validator="true"
                        data-my-validator-required="true"
                        data-my-validator-name=""
                        data-my-validator-type="text"
                        placeholder={LANG_ARTICLE['preface']}
                        onBlur={this.onBlur.bind(this)}
                        style={{'float':'none','display':'inline-block'}}
                        onChange={this.setPreface.bind(this)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_ARTICLE['desc']}</div>
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="desc"
                        ref="desc"
                        className="form-control input-sm"
                        value={desc}
                        data-my-validator="true"
                        data-my-validator-required="true"
                        data-my-validator-name=""
                        data-my-validator-type="text"
                        placeholder={LANG_ARTICLE['desc']}
                        onBlur={this.onBlur.bind(this)}
                        style={{'float':'none','display':'inline-block'}}
                        onChange={this.setDesc.bind(this)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_ARTICLE['type']}</div>
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="type"
                        ref="type"
                        className="form-control input-sm"
                        value={type}
                        data-my-validator="true"
                        data-my-validator-required="false"
                        data-my-validator-name=""
                        data-my-validator-type="text"
                        placeholder={LANG_ARTICLE['type']}
                        onBlur={this.onBlur.bind(this)}
                        style={{'float':'none','display':'inline-block'}}
                        onChange={this.setType.bind(this)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_ARTICLE['level']}</div>
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="level"
                        ref="level"
                        className="form-control input-sm"
                        value={level}
                        data-my-validator="true"
                        data-my-validator-required="false"
                        data-my-validator-name=""
                        data-my-validator-type="number"
                        placeholder={LANG_ARTICLE['level']}
                        onBlur={this.onBlur.bind(this)}
                        style={{'float':'none','display':'inline-block'}}
                        onChange={this.setLevel.bind(this)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_NAV['article-category']}</div>
                    <div className="input-group width-100pc" style={{'position':'relative','background':'#fff'}}>
                      <select
                        ref="articleCategory"
                        onChange={this.setArticleCategory.bind(this)}
                        style={{'float':'none','display':'inline-block','paddingRight':'28px', 'paddingLeft':'8px', 'height':'30px', 'width':'100%', 'borderColor':'#ccc'}}
                        value={articleCategory}
                      >
                        {articleCategoryOptionsHtml}
                      </select>
                      <div className="select-arrow"></div>
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_ARTICLE['sequence']}</div>
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="sequence"
                        ref="sequence"
                        className="form-control input-sm"
                        value={sequence}
                        data-my-validator="true"
                        data-my-validator-required="false"
                        data-my-validator-name=""
                        data-my-validator-type="number"
                        placeholder={LANG_ARTICLE['sequence']}
                        onBlur={this.onBlur.bind(this)}
                        style={{'float':'none','display':'inline-block'}}
                        onChange={this.setSequence.bind(this)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="title">{LANG_ARTICLE['tag']}</div>
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="tag"
                        ref="tag"
                        className="form-control input-sm"
                        value={tag}
                        data-my-validator="true"
                        data-my-validator-required="false"
                        data-my-validator-name=""
                        data-my-validator-type="text"
                        placeholder={LANG_ARTICLE['tag']}
                        onBlur={this.onBlur.bind(this)}
                        style={{'float':'none','display':'inline-block'}}
                        onChange={this.setTag.bind(this)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="title">{LANG_ARTICLE['content']}</div>
                  <TinyMCE
                    content={content}
                    config={{
                      plugins: 'autolink link image lists print preview',
                      toolbar: 'imageupload | undo redo | bold italic | alignleft aligncenter alignright',
                      setup: (editor) => {
                        this.editor = editor;
                        editor.addButton( 'imageupload', {
                          text: 'Upload image',
                          icon: false,
                          onclick: (e) => {
                            $('#contentFilePicker').click();
                          }
                        });
                      }
                    }}
                    onChange={this.handleEditorChange.bind(this)}
                  />
                  <div className="height-20"></div>
                  <div className="form-check step-content__text mgt-15 mgb-20">
                    <label className="form-check-label fw-reg" style={{'marginBottom':'0'}}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onClick={this.setIsBanned.bind(this, !isBanned)}
                        checked={isBanned}
                        onChange={this.onCheckChange.bind(this)}
                      />
                      &nbsp;<span className="">{`${LANG_ARTICLE['banned']}`}</span>
                    </label>
                  </div>
                  <div className="form-check step-content__text mgt-15 mgb-20">
                    <label className="form-check-label fw-reg" style={{'marginBottom':'0'}}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onClick={this.setIsPrivate.bind(this, !isPrivate)}
                        checked={isPrivate}
                        onChange={this.onCheckChange.bind(this)}
                      />
                      &nbsp;<span className="">{`${LANG_ARTICLE['private']}`}</span>
                    </label>
                  </div>
                  <div className="form-check step-content__text mgt-15 mgb-20">
                    <label className="form-check-label fw-reg" style={{'marginBottom':'0'}}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onClick={this.setIsAdminOnly.bind(this, !isAdminOnly)}
                        checked={isAdminOnly}
                        onChange={this.onCheckChange.bind(this)}
                      />
                      &nbsp;<span className="">{`${LANG_ARTICLE['admin-only']}`}</span>
                    </label>
                  </div>
                  <div className="submit-button my-button my-button--blue" onClick={this.submit.bind(this)}>{LANG_ACTION.confirm}</div>
                  <div className="height-20"></div>
                  <input type="submit" className="hidden"/>
                  <div id="contentContainer" className="hidden"><div id="contentFilePicker"></div></div>
                </form>
              </div>
              <div className="push"></div>
            </div>
            <Footer/>
          </div>
        );
      }
    }
    return(
      <div className="page">
        {contentHtml}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    locale,
    isNotFound,
    currentUser,
  } = state;
  return {
    locale,
    isNotFound,
    currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setIsNotFound: (val) => {
      dispatch(setIsNotFound(val));
    },
  };
}

ArticleCategoryForm.contextTypes = {
  router: React.PropTypes.object
};

ArticleCategoryForm.propTypes = {
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  isLoading: React.PropTypes.bool,
  locale: React.PropTypes.string,
  currentUser: React.PropTypes.object,
  setIsNotFound: React.PropTypes.func,
  onChange: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleCategoryForm);
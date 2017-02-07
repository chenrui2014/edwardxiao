import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
// import RichTextEditor from 'react-rte';
import RichTextEditor from 'react-rte-image';
import {
  fetchArticleList,
  setIsNotFound,
} from '../../actions/index';

import Validator from '../../../common/my_validator';
let validator = new Validator();

import Utils from '../../../common/utils';

import MobileNav from '../../components/MobileNav/index';
import Nav from '../../components/Nav/index';
import Footer from '../../components/Footer/index';
import NotFound from '../NotFound';
import '../../../../css/articles.css';

class ArticleForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      backUrl: null,
      id: '',
      title: '',
      author: '',
      preface: '',
      desc: '',
      cover: '',
      articleCategory: '',
      type: '',
      tag: '',
      isBanned: false,
      isPrivate: false,
      content: RichTextEditor.createEmptyValue(),
      articleCategoryOptions: [],
      isUploading: false,
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    if (!_.isNull(this.props.userInfo) && this.props.userInfo.role == 'admin'){
      this.setIsLoading(false);
      this.fetchArticleCategoryOptions();
    }
    else{
      this.props.setIsNotFound(true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isLoading && !this.state.isLoading){
      this.initQiniu();
    }
  }

  initQiniu(){
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',      // 上传模式,依次退化
        browse_button: 'pickfiles',         // 上传选择的点选按钮，**必需**
        uptoken_url: '/api/settings/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
        get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
        unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
        domain: QINIU_DOMAIN,     // bucket 域名，下载资源时用到，**必需**
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
              var domain = `http://${QINIU_DOMAIN}/`;
              var res = JSON.parse(info);
              var sourceLink = domain + res.key; //获取上传成功后的文件的Url
              this.setState({
                cover: `${sourceLink}`,
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
      console.log(res);
      if (res.code === 0){
        // console.log(res.data);
        this.setState({articleCategoryOptions: res.data});
        if (res.data.length){
          this.setState({articleCategory: res.data[0].id});
        }
        Utils.stopSpin('spin-loader');
      }
      else{
        if(res.msg){
          alert(res.msg);
        }
      }
    }).catch((err) => {
      // debugger;
      // alert('网络错误，请重试');
      console.log(err);
    });
  }

  fetchArticleCategoryOptionsApi() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/articleCategories/options',
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
        author,
        preface,
        desc,
        cover,
        articleCategory,
        type,
        tag,
        isBanned,
        isPrivate,
        content,
      } = this.state;
      this.submitForm(id, title, author, preface, desc, cover, articleCategory, type, tag, isBanned, isPrivate, content.toString('html'));
    }
    e.preventDefault();
  }

  submitForm(id, title, author, preface, desc, cover, articleCategory, type, tag, isBanned, isPrivate, content){
    Utils.initSpin('spin-loader');
    this.submitFormApi(id, title, author, preface, desc, cover, articleCategory, type, tag, isBanned, isPrivate, content).then((res) => {
      console.log(res);
      if (res.code === 0){
        // console.log(res.data);
        this.context.router.push('/articles/' + res.id);
        Utils.stopSpin('spin-loader');
      }
      else{
        if(res.msg){
          alert(res.msg);
        }
      }
    }).catch((err) => {
      // debugger;
      // alert('网络错误，请重试');
      console.log(err);
    });
  }

  submitFormApi(id, title, author, preface, desc, cover, articleCategory, type, tag, isBanned, isPrivate, content){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/articles',
        type: 'post',
        data: {id, title, author, preface, desc, cover, articleCategory, type, tag, isBanned, isPrivate, content},
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

  render() {
    let contentHtml;
    let {
      locale,
      isNotFound,
      articleList,
      userInfo,
    } = this.props;
    let {
      isLoading,
      isUploading,
      id,
      title,
      author,
      preface,
      desc,
      cover,
      articleCategory,
      type,
      tag,
      isBanned,
      isPrivate,
      content,
      articleCategoryOptions,
    } = this.state;
    if (isNotFound){
      contentHtml = (<NotFound />);
    }
    else{

      let coverHtml;
      let coverImageHtml;
      let previewClass;
      let cameraHtml = (<div className="camera-mask"><span className="icon icon-camera-alt"></span></div>);
      if (!isUploading && cover != ''){
        coverImageHtml = (<img className="" src={`${cover}?imageView/1/w/${300}/h/${300}`} style={{'width':'100%'}} onLoad={this.handleImageLoaded.bind(this)}/>);
        previewClass = 'preview';
      }
      coverHtml = (
        <div className={`cover-holder ${previewClass}`}>
          <div className="spin-loader" id="cover-spin-loader" style={{'zIndex':'999'}}></div>
          {coverImageHtml}
          {cameraHtml}
        </div>
      );

      let LANG_ARTICLE = require('../../../../../locales/' + locale + '/article');
      let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
      let articleListHtml;
      let articleCategoryOptionsHtml;
      let newArticleButton;
      if (!isLoading){
        if (articleCategoryOptions.length){
          articleCategoryOptionsHtml = articleCategoryOptions.map((item, key) => {
            return (
              <option value={item.id}>{item.title}</option>
            );
          });
        }
        let backUrl = this.state.backUrl;
        console.log(userInfo);
        const toolbarConfig = {
          // Optionally specify the groups to display (displayed in the order listed).
          display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'IMAGE_BUTTON', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
          INLINE_STYLE_BUTTONS: [
            {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
            {label: 'Italic', style: 'ITALIC'},
            {label: 'Underline', style: 'UNDERLINE'}
          ],
          BLOCK_TYPE_DROPDOWN: [
            {label: 'Normal', style: 'unstyled'},
            {label: 'Heading Large', style: 'header-one'},
            {label: 'Heading Medium', style: 'header-two'},
            {label: 'Heading Small', style: 'header-three'}
          ],
          BLOCK_TYPE_BUTTONS: [
            {label: 'UL', style: 'unordered-list-item'},
            {label: 'OL', style: 'ordered-list-item'}
          ]
        };
        contentHtml = (
          <div className="page-content article background-grey-4a">
            <MobileNav isIndex={false} activeTab="articles"/>
            <Nav isIndex={false} activeTab="articles"/>
            <div className="core-content background-grey-4a">
              {newArticleButton}
              {articleListHtml}
              <div className="core">
                <form className="submit" id="submit" onSubmit={this.submit.bind(this)} autoComplete="off">
                  <div id="container" className="cover-container">
                    <div className="cover-picker" id="pickfiles">
                      {coverHtml}
                    </div>
                  </div>
                  <div className="row-wrapper">
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
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="type"
                        ref="type"
                        className="form-control input-sm"
                        value={type}
                        data-my-validator="true"
                        data-my-validator-required="true"
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
                    <div className="input-group background-white width-100pc" style={{'position':'relative'}}>
                      <select
                        ref="articleCategory"
                        onChange={this.setArticleCategory.bind(this)}
                        style={{'float':'none','display':'inline-block','padding-right':'28px', 'padding-left':'8px', 'height':'30px', 'width':'100%'}}
                        value={articleCategory}
                      >
                        {articleCategoryOptionsHtml}
                      </select>
                      <div className="select-arrow"></div>
                    </div>
                  </div>
                  <div className="row-wrapper">
                    <div className="input-group width-100pc">
                      <input
                        type="text"
                        id="tag"
                        ref="tag"
                        className="form-control input-sm"
                        value={tag}
                        data-my-validator="true"
                        data-my-validator-required="true"
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
                  <RichTextEditor
                    value={content}
                    onChange={this.onChange.bind(this)}
                  />
                  <div className="height-20"></div>
                  <div className="form-check step-content__text mgt-15 mgb-20">
                    <label className="form-check-label fw-reg" style={{'margin-bottom':'0'}}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onClick={this.setIsBanned.bind(this, !isBanned)}
                      />
                      &nbsp;<span className="white">{`${LANG_ARTICLE['banned']}`}</span>
                    </label>
                  </div>
                  <div className="form-check step-content__text mgt-15 mgb-20">
                    <label className="form-check-label fw-reg" style={{'margin-bottom':'0'}}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onClick={this.setIsPrivate.bind(this, !isPrivate)}
                      />
                      &nbsp;<span className="white">{`${LANG_ARTICLE['private']}`}</span>
                    </label>
                  </div>
                  <div className="submit-button my-button my-button--blue" onClick={this.submit.bind(this)}>{LANG_ACTION.confirm}</div>
                  <div className="height-20"></div>
                  <input type="submit" className="hidden"/>
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
    articleList,
    isNotFound,
    userInfo,
  } = state;
  return {
    locale,
    articleList,
    isNotFound,
    userInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchArticleList: () => {
      dispatch(fetchArticleList());
    },
    setIsNotFound: (val) => {
      dispatch(setIsNotFound(val));
    },
  };
}

ArticleForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

ArticleForm.propTypes = {
  params: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  locale: React.PropTypes.string.isRequired,
  userInfo: React.PropTypes.object.isRequired,
  articleList: React.PropTypes.array.isRequired,
  fetchArticleList: React.PropTypes.func.isRequired,
  setIsNotFound: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleForm);
import _ from 'lodash';
class MyValidator {

  constructor() {

  }

  validate($this, name = '', locale = __PRELOADED_STATE__.locale) {
    const LANG_FILE = {
      'zh-CN': require('../../../locales/zh-CN/validator'),
      'zh-HK': require('../../../locales/zh-HK/validator'),
      'en-US': require('../../../locales/en-US/validator'),
    };
    let isMyValidator = $this.data('my-validator');
    let $parent = $this.parent();
    let $message = $parent.next('div[class^="my-validator-message"]');
    let $inputType = $this.attr('type');
    let $elType = $this.prop('type');
    let error = false;
    let message;
    let validatorRequired = $this.data('my-validator-required');
    if (name == ''){
      name = $this.data('my-validator-name');
    }
    if ($inputType == 'text' || $inputType == 'tel' || $inputType == 'date' || $this.is('textarea') || $elType == 'select-one' || $elType == 'password'){
      if (isMyValidator){
        let $val = $this.val();
        let isEmpty = _.isEmpty($val);
        if (validatorRequired){
          if (isEmpty){
            error = true;
            message = LANG_FILE[locale]['please-complete'];
          }
        }
        let validatorType = $this.data('my-validator-type');
        let validatorLength = $this.data('my-validator-length');
        let validatorMinLength = $this.data('my-validator-min-length');
        let validatorMaxLength = $this.data('my-validator-max-length');
        let validatorMinAmount = $this.data('my-validator-min-amount');
        let validatorMaxAmount = $this.data('my-validator-max-amount');
        let showValidMessage = $this.data('my-validator-show-valid-message');
        let compareId = $this.data('my-validator-compare-id');

        if (validatorType == 'email'){
          if (!this.isEmail($val) && !isEmpty){
            error = true;
            message = LANG_FILE[locale]['invalid-format'];
          }
        }
        if (validatorType == 'number' && !isEmpty){
          if ((_.isNaN(_.toNumber($val)) || !_.isNumber(_.toNumber($val))) && !isEmpty){
            error = true;
            message = LANG_FILE[locale]['invalid-format'];
          }
        }
        if (!error && validatorLength){
          let result = this.validateExactLength($val, name, validatorLength, locale);
          error = result.error;
          message = result.message;
        }
        if (!error && (validatorMinLength || validatorMaxLength)){
          let result = this.validateLength($val, name, validatorMinLength, validatorMaxLength, locale);
          error = result.error;
          message = result.message;
        }
        if (!error && (validatorMinAmount || validatorMaxAmount)){
          let result = this.validateAmount($val, name, validatorMinAmount, validatorMaxAmount, locale);
          error = result.error;
          message = result.message;
        }
        if (!error && !_.isUndefined(compareId) && compareId != ''){
          let compareVal = $('#' + compareId).val();
          let result = this.validateEqualValue(name, $this.val(), compareVal, locale);
          error = result.error;
          message = result.message;
        }
        if ((validatorRequired && $message.length <= 0) || (!validatorRequired && $message.length <= 0 && $val.length > 0)){
          if (error){
            $parent.addClass('has-error');
            this.createMessage($parent, message, 'error');
          }
          else{
            if (showValidMessage){
              message = LANG_FILE[locale]['correct'];
              $parent.addClass('has-success');
              this.createMessage($parent, message, 'success');
            }
          }
        }
        else{
           if (error && $message.length <= 0){
            $parent.addClass('has-error');
            this.createMessage($parent, message, 'error');
          }
        }
      }
    }
    else if ($inputType == 'checkbox'){
      if (isMyValidator && $message.length <= 0){
        if (validatorRequired){
          if (!$this.is(':checked')){
            message = LANG_FILE[locale]['please-check'] + name;
            $parent.addClass('has-error');
            this.createMessage($parent, message, 'error');
            error = true;
          }
        }
      }
      else if($message.length > 0){
        error = true;
      }
    }
    if(error){
      return false;
    }
    return true;
  }

  validateLength (val, name, validatorMinLength, validatorMaxLength, locale = __PRELOADED_STATE__.locale){
    const LANG_FILE = {
      'zh-CN': require('../../../locales/zh-CN/validator'),
      'zh-HK': require('../../../locales/zh-HK/validator'),
      'en-US': require('../../../locales/en-US/validator'),
    };
    validatorMinLength = _.toNumber(validatorMinLength);
    validatorMaxLength = _.toNumber(validatorMaxLength);
    let result = {
      error: false,
      message: ''
    };
    if (validatorMinLength && val.length < validatorMinLength){
      result.error = true;
      result.message = name +  LANG_FILE[locale]['cannot-less-than'] + validatorMinLength + LANG_FILE[locale]['charactor-number'];
      // result.message = '输入错误';
    }
    if (validatorMinLength && val.length > validatorMaxLength){
      result.error = true;
      result.message = name + LANG_FILE[locale]['cannot-great-than'] + validatorMaxLength + LANG_FILE[locale]['charactor-number'];
      // result.message = '输入错误';
    }
    return result;
  }

  validateExactLength (val, name, validatorLength, locale = __PRELOADED_STATE__.locale){
    const LANG_FILE = {
      'zh-CN': require('../../../locales/zh-CN/validator'),
      'zh-HK': require('../../../locales/zh-HK/validator'),
      'en-US': require('../../../locales/en-US/validator'),
    };
    validatorLength = _.toNumber(validatorLength);
    let result = {
      error: false,
      message: ''
    };
    if (validatorLength && (val.length != validatorLength)){
      result.error = true;
      // result.message = name + '长度必须为' + validatorLength;
      result.message = LANG_FILE[locale]['invalid-format'];
    }
    return result;
  }

  validateAmount (val, name, validatorMinAmount, validatorMaxAmount, locale = __PRELOADED_STATE__.locale){
    const LANG_FILE = {
      'zh-CN': require('../../../locales/zh-CN/validator'),
      'zh-HK': require('../../../locales/zh-HK/validator'),
      'en-US': require('../../../locales/en-US/validator'),
    };
    val = _.toNumber(val);
    validatorMinAmount = _.toNumber(validatorMinAmount);
    validatorMaxAmount = _.toNumber(validatorMaxAmount);
    let result = {
      error: false,
      message: ''
    };
    if (validatorMinAmount && val < validatorMinAmount){
      result.error = true;
      // result.message = name + '不能小于' + validatorMinAmount;
      result.message = LANG_FILE[locale]['invalid-amount'];
    }
    if (validatorMaxAmount && val > validatorMaxAmount){
      result.error = true;
      // result.message = name + '不能超过' + validatorMaxAmount;
      result.message = LANG_FILE[locale]['invalid-amount'];
    }
    return result;
  }

  validateEqualValue(name, val1, val2, locale = __PRELOADED_STATE__.locale){
    const LANG_FILE = {
      'zh-CN': require('../../../locales/zh-CN/validator'),
      'zh-HK': require('../../../locales/zh-HK/validator'),
      'en-US': require('../../../locales/en-US/validator'),
    };
    val1 = _.toString(val1);
    val2 = _.toString(val2);
    let result = {
      error: false,
      message: ''
    };
    if (val1 != val2){
      result.error = true;
      result.message = LANG_FILE[locale]['twice-times'] + name + LANG_FILE[locale]['not-equal'];
    }
    return result;
  }

  removeValidate($this){
    let isMyValidator = $this.data('my-validator');
    if (isMyValidator){
      let $parent = $this.parent();
      $parent.removeClass('has-error has-warning has-success');
      this.removeMessage($parent);
    }
  }

  init(){
    $(document).on('blur', 'input, textarea', { MyValidator : this }, function(event){
      event.data.MyValidator.validate($(this));
    });
    $(document).on('keyup', 'input, textarea', { MyValidator : this }, function(event) {
      event.data.MyValidator.removeValidate($(this));
    });
    $(document).on('change', ':checkbox', { MyValidator : this }, function(event) {
      if(this.checked){
        event.data.MyValidator.removeValidate($(this));
      }
      else{
        event.data.MyValidator.validate($(this));
      }
    });
    $(document).on('change', 'input[type=date]', { MyValidator : this }, function(event) {
      event.data.MyValidator.removeValidate($(this));
    });
    $(document).on('change', 'select', { MyValidator : this }, function(event){
      event.data.MyValidator.removeValidate($(this));
      event.data.MyValidator.validate($(this));
    });
  }

  isValidForm($form){
    let valid = true;
    $form.find('input, textarea, select').map((key, item)=>{
      if (!this.validate($(item))){
        valid = false;
      }
    });
    return valid;
  }

  createMessage($parent, message, type='normal'){
    let icon = '';
    if (type == 'error'){
      $parent.addClass('has-error');
      icon = '<span class=\'glyphicon glyphicon-exclamation-sign\'></span>';
    }
    else if (type == 'success'){
      icon = '<span class=\'glyphicon glyphicon-ok-circle\'></span>';
    }
    let el = '<div class=\'my-validator-message my-validator-message--' + type + '\'>'+ icon + '&nbsp<span>' + message + '</span></div>';
    $parent.after(el);
    return el;
  }

  removeMessage($parent){
    $parent.removeClass('has-error');
    $parent.next('.my-validator-message').remove();
  }

  isEmail(email){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}

export default MyValidator;
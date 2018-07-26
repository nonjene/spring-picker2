import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

const bodyFixSty = {
  position:'fixed',
  overflow:'hidden',
  width:'100%',
  height:'100%',
}
const propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  fixIosBodyScroll: PropTypes.bool,
};
const defaultProps = {
  visible: false,
  fixIosBodyScroll: true,
}

class BaseModal extends React.Component {
  constructor(props) {
    super(props);

  }
  fixBodyScroll(visible){
    if(this.props.fixIosBodyScroll && /iPad|iPhone|iPod/.test(navigator.userAgent)){
      if(visible){
        this._cacheBodyScroll = document.body.scrollTop || document.documentElement.scrollTop;
        this._cacheBodySty = Object.keys(bodyFixSty).reduce((cache, name)=>{
          cache[name] = document.body.style[name];
          document.body.style[name] = bodyFixSty[name];
          return cache;
        }, {});
        //修改body style后会重置scroll，重新定位到原来的滚动位置
        //包含判断是否为0，0时也不进行重新定位，因为这种情况的话，开发者已经把body.height设置了100%
        //这时候滚动位置不受style修改的影响
        if(this._cacheBodyScroll){
          document.body.scrollTop = this._cacheBodyScroll;
        }
        
      }else{
        Object.keys(bodyFixSty).forEach(name=>{
          document.body.style[name] = this._cacheBodySty[name]||'';
        });
      }
    }
  }
  componentWillReceiveProps(nexProps){
    if(nexProps.visible !== this.props.visible){
      this.fixBodyScroll(nexProps.visible);
    }
  }
  componentDidMount() {
    this.props.visible && this.fixBodyScroll(this.props.visible);
  }
  componentWillUnmount(){}
  handleClickOverlay(){
    this.props.onCancel && this.props.onCancel();
  }
  handleClickModal(e){
    e.stopPropagation();
  }

  render() {
    return (
      <div
        className="modal-overlay"
        onClick={this.handleClickOverlay.bind(this)}
      >
        <div
          className="modal"
          onClick={this.handleClickModal.bind(this)}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

BaseModal.propTypes = propTypes;
BaseModal.defaultProps = defaultProps;

export default function(props) {
  return (
    <CSSTransition
      classNames="modal-transition"
      timeout={240}
      in={props.visible}
      unmountOnExit
    >
      <BaseModal {...props} />
    </CSSTransition>
  );
}

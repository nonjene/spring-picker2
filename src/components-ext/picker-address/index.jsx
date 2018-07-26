import React from 'react';
import PropTypes from 'prop-types';
import { PopupPicker } from '../../components';
import { provins, citys, areas } from './address';
import './index.scss';

const getProvinsList = () => {
  return provins.map((name, i) => ({ name, value: i }));
};

const getCitysList = provinName => {
  return citys[provinName].map((name, i) => ({ name, value: i }));
};

const getAreasList = citysName => {
  return areas[citysName].map((name, i) => ({ name, value: i }));
};

const getProvNameByIndex = ind => {
  return provins[ind];
};

const getCityNameByIndex = (provInd, cityInd) => {
  return citys[getProvNameByIndex(provInd)][cityInd];
};

const getAreaNameByIndex = (provInd, cityInd, areaInd) => {
  return areas[getCityNameByIndex(provInd, cityInd)][areaInd];
};

const propTypes = {
  selectedValue: PropTypes.object,
  onCancel: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onChanging: PropTypes.func
};
const defaultProps = {
  visible: false,
  selectedValue: null
};

class PickerAddress extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    const selectedValue = props.selectedValue
      ? props.selectedValue
      : {
          prov: 0,
          city: 0,
          area: 0
        };
    this.state = {
      visible: props.visible,
      selectedValue
    };
  }

  handleSelect(selectedValue, selectedName) {
    this.setState({
      visible: false
    });
    this.props.onSelect(selectedValue, selectedName);
  }

  handleChanging(selectedValue, key, value, name) {
    console.log(selectedValue, key, value, name);
    let { prov, city, area } = selectedValue;
    switch (key) {
      case 'prov':
        city = 0;
        area = 0;
        break;
      case 'city':
        area = 0;
        break;
    }
    this.setState(
      {
        selectedValue: { prov, city, area }
      },
      () => {
        this.props.onChanging &&
          this.props.onChanging(selectedValue, key, value, name);
      }
    );
  }

  handleCancel() {
    this.setState({ visible: false }, () => {
      this.props.onCancel && this.props.onCancel();
    });
  }
  componentWillReceiveProps(nexProps) {
    if (
      this.props.visible !== nexProps.visible &&
      nexProps.visible !== this.state.visible
    ) {
      this.setState({
        visible: nexProps.visible
      });
    }

    // 选项更新
    if (
      nexProps.selectedValue &&
      Object.keys(nexProps.selectedValue).find(
        key => this.state.selectedValue[key] !== nexProps.selectedValue[key]
      )
    ) {
      this.setState({
        selectedValue: nexProps.selectedValue
      });
    }
  }

  render() {
    const selected = this.state.selectedValue;
    const provList = getProvinsList();
    const cityList = getCitysList(getProvNameByIndex(selected.prov || 0));
    const areaList = getAreasList(
      getCityNameByIndex(selected.prov || 0, selected.city || 0)
    );
    return (
      <div className="ui-picker-address">
        <PopupPicker
          data={{
            prov: provList,
            city: cityList,
            area: areaList
          }}
          selectedValue={selected}
          visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)}
          onSelect={this.handleSelect.bind(this)}
          onChanging={this.handleChanging.bind(this)}
        />
      </div>
    );
  }
}

PickerAddress.propTypes = propTypes;
PickerAddress.defaultProps = defaultProps;
export default PickerAddress;

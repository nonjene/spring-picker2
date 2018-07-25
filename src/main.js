import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import Layout from './container/layout';
import PickerDemo from './container/picker/picker-demo';

import './scss/index.scss';

render(
  <Layout>
    <PickerDemo/>
  </Layout>,
  document.getElementById('app')
);

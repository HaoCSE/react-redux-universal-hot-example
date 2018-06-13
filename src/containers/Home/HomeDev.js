import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';
// import config from '../../config';
import Helmet from 'react-helmet';
import { translate } from 'react-i18next';
import * as homeActions from 'redux/modules/home'; // remove this one
// import {isLoaded, load as loadWidgets} from 'redux/modules/widgets';

import {
  Button
  // ,Pagination,
  ,PageItem
  ,Pager
} from 'react-bootstrap';
import { asyncConnect } from 'redux-async-connect';
import {connect} from 'react-redux';

// import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import ReactHtmlParser
  , { processNodes, convertNodeToElement, htmlparser2 }
from 'react-html-parser';

import Select from 'react-select';

const { isLoaded, loadContents } = homeActions;

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    // console.log("asyncConnect");
    if (!isLoaded(getState())) {
      // console.log("not in here?");
      return dispatch(loadContents());
    }
  }
}])

@connect(
  state => ({
    directions: state.home.data
  }),
  { ...homeActions }
)

@translate(['common'])
export default class HomeDev extends Component {
  static propTypes = {
    t: PropTypes.func,
    directions: PropTypes.array,
  }

  state = {
    selectedOption: '',
  }
  // componentDidMount() {
  //   // require('katex/dist/katex.min.css');
  //   // this.forceUpdate();
  //   const _SortableTree = require('react-sortable-tree').default;
  //
  // }

  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
     this._ismounted = false;
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
		// selectedOption can be null when the `x` (close) button is clicked
		if (selectedOption) {
    	console.log(`Selected: ${selectedOption.label}`);
		}
  }

  render() {
    const styles = require('./Home.scss');
    const { selectedOption } = this.state;
    // console.log("stylessss....");
    // console.log(styles);
    // require('katex/dist/katex.min.css');
    // require('../../theme/katex.scss');
    // require('./katex.scss');
    // require the logo image both from client and server
    // const logoImage = require('./logo.png');

    const {
      t
      ,directions
    } = this.props;

    const initialData = [
      { id: '1', name: 'N1', parent: null },
      { id: '2', name: 'N2', parent: null },
      { id: '3', name: 'N3', parent: 2 },
      { id: '4', name: 'N4', parent: 3 },
    ];
    // let _SortableTree;

    // Update to React > 15.3 to use
    // if (this._ismounted) {
    //   // const _SortableTree = require('react-sortable-tree').default;
    //   const SortableTree = require('react-sortable-tree').default;
    //   return (<SortableTree
    //     treeData={initialData} />);
    // }
    // else {
    //   return (<div></div>)
    // }


    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">
          {
            <Button bsStyle="link" onClick={() => this.props.history.push(`/lessons`)}>
            {t('content.all_lessons')}
            </Button>
          }

          <Select
            name="form-field-name"
            value={selectedOption}
            onChange={this.handleChange}
            options={[
              { value: 'one', label: 'One' },
              { value: 'two', label: 'Two' },
            ]}
          />
          <Pager>
            <PageItem next onSelect={() => this.props.history.push(`/page/2`)} href="/page/2" >{t('content.next_page')} &rarr;</PageItem>
          </Pager>
          <div>
            {
              directions !== undefined &&
                directions.map((item, i) => {
                  // console.log(item);
                  if (item.active === 1) {
                    return (
                      <div>
                        <b dangerouslySetInnerHTML={{ __html: item.name }} /><span> from </span>
                          <Button bsStyle="link" onClick={() => this.props.history.push(`/lesson/${item.lessonsId}`)}>
                            {t('content.lesson')}
                          </Button>

                        <div>{item &&  ReactHtmlParser(item.data, {decodeEntities: true, transform: (node, index) => {
                            if (node.type === 'tag' && node.name === 'span' && node.attribs.class === "math-q") {
                              // node.name = 'InlineMath';
                              // console.log("what");
                              // console.log(node);
                              // console.log(index);
                              return <InlineMath math={node.children[0].data.slice(2,-2)} />;
                            }

                            //Find image tag: <span><img src=\"content/lessons/28/obitan_1.PNG\" /></span>
                            if (node.type === 'tag' && node.name === 'img') {
                              // console.log(node);
                              if (node.attribs.src.startsWith('content/lessons/')) {
                                // console.log("matchedddd.....");
                                var newSrc = 'http://hochochoc.com/www/' + node.attribs.src; //should be dynamic.... by using env...

                                return <img src={newSrc} />;
                              }
                            }
                          }})}</div>
                        <Button bsStyle="link" onClick={() => this.props.history.push(`/content/${item.id}`)}>
                          {t('content.see_more')}
                        </Button>
                      </div>
                    );
                  }
                })
              }
          </div>
          <Pager>
            <PageItem next onSelect={() => this.props.history.push(`/page/2`)} href="/page/2" >{t('content.next_page')} &rarr;</PageItem>
          </Pager>
        </div>
      </div>
    );
  }
}

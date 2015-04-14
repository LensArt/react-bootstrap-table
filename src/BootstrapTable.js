import React from 'react';
import classSet from 'classnames';
import Const from './Const';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import PaginationList from './pagination/PaginationList';

class BootstrapTable extends React.Component{

  constructor(props) {
		super(props);
		this.state = {
      data: this.props.data
    };
    this.sortTable = false;
    this.order = Const.SORT_DESC;
    this.sortField = null;
	}

  componentWillMount(){
    if(this.props.pagination)
      this.handlePaginationData(1, Const.SIZE_PER_PAGE);
  }

  componentDidMount(){
    this.refs.table.getDOMNode().childNodes[0].childNodes[0].style.width =
      this.refs.table.getDOMNode().childNodes[1].childNodes[0].offsetWidth-1+"px";
  }

  render(){
    var style = {
      height: this.props.height,
      marginBottom: "37px"
    };

    var columns = this.props.children.map(function(column, i){
      if(column.props.dataSort) this.sortTable = true;
      return {
        name: column.props.dataField,
        align: column.props.dataAlign,
        sort: column.props.dataSort,
        format: column.props.dataFormat,
        index: i
      };
    }, this);

    var pagination = this.renderPagination();
    return(
      <div>
        <div ref="table" style={style}>
          <TableHeader onSort={this.handleSort.bind(this)}>
            {this.props.children}
          </TableHeader>
          <TableBody data={this.state.data} columns={columns}
            striped={this.props.striped}
            hover={this.props.hover}
            condensed={this.props.condensed}/>
        </div>
        <div>
          {pagination}
        </div>
      </div>
    )
  }

  handleSort(order, sortField){
    this.order = order;
    this.sortField = sortField;

    this.setState({data: this._sort(this.state.data, order, sortField)});
  }

  handlePaginationData(page, sizePerPage){
    var end = page*sizePerPage-1;
    var start = end - (sizePerPage - 1);
    var arr = [];
    for(var i=start;i<=end;i++){
      arr.push(this.props.data[i]);
      if(i+1 == this.props.data.length)break;
    }

    if(this.sortTable && null != this.sortField)
      arr = this._sort(arr, this.order, this.sortField);
    this.setState({data: arr});
  }

  _sort(arr, order, sortField){
    arr.sort(function(a,b){
      if(order == Const.SORT_ASC){
        return a[sortField] > b[sortField]?-1: ((a[sortField] < b[sortField]) ? 1 : 0);
      }else{
        return a[sortField] < b[sortField]?-1: ((a[sortField] > b[sortField]) ? 1 : 0);
      }
    });
    return arr;
  }

  renderPagination(){
    if(this.props.pagination){
      return(
        <PaginationList changePage={this.handlePaginationData.bind(this)}
                        sizePerPage={Const.SIZE_PER_PAGE}
                        dataSize={this.props.data.length}/>
      )
    }else {
      return null;
    }
  }
}
BootstrapTable.propTypes = {
  height: React.PropTypes.string,
  data: React.PropTypes.array,
  striped: React.PropTypes.bool,
  hover: React.PropTypes.bool,
  condensed: React.PropTypes.bool,
  pagination: React.PropTypes.bool
};
BootstrapTable.defaultProps = {
  height: "100%",
  striped: false,
  hover: false,
  condensed: false,
  pagination: false
};

export default BootstrapTable;
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource as dragSource } from 'react-dnd';
import { DropTarget as dropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import flow from 'lodash/flow';
import Card from './Card';


const propTypes = {
  item: PropTypes.object,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  // connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired,
  dragItem: PropTypes.object
};


function getStyles(isDragging) {
  return {
    display: isDragging ? 0.5 : 1
  };
}

class CardComponent extends Component {
  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    });
  }

  render() {
    const { isDragging, connectDragSource, item, dragItem } = this.props;

    return connectDragSource(
      <div>
        <Card style={getStyles(isDragging)} item={item} isDragging={isDragging} />
      </div>
    );
  }
}

CardComponent.propTypes = propTypes;

const cardSource = {
  beginDrag(props, monitor, component) {
    const { item, x, y } = props;
    const { id, title, left, top } = item;
    const { clientWidth, clientHeight } = findDOMNode(component);
    // try use getBoundingClientRect
    return { id, title, left, top, item, x, y, clientWidth, clientHeight };
  },
  isDragging(props, monitor) {
    const isDragging = props.item && props.item.id === monitor.getItem().id;
    return isDragging;
  }
};

const cardTarget = {
  drop(props, monitor, component) {
    // TODO save item to board after end druging
    const draggedId = monitor.getItem().id;
    const dragIndexX = monitor.getItem().x;
    const dragIndexY = monitor.getItem().y;
    const hoverIndexX = props.x;
    const hoverIndexY = props.y;
    if (dragIndexX === hoverIndexX && dragIndexY === hoverIndexY) {
      return;
    }
    props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
  },
  hover(props, monitor, component) {
    // const draggedId = monitor.getItem().id;

    // const dragIndexX = monitor.getItem().x;
    // const dragIndexY = monitor.getItem().y;

    // const hoverIndexX = props.x;
    // const hoverIndexY = props.y;

    // if (dragIndexX === hoverIndexX && dragIndexY === hoverIndexY) {
    //   return;
    // }


    // const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // const clientOffset = monitor.getClientOffset();
    // const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // if (dragIndexX < hoverIndexX && hoverClientY < hoverMiddleY) {
    //   return;
    // }
    // if (dragIndexX > hoverIndexX && hoverClientY > hoverMiddleY) {
    //   return;
    // }
    // if (draggedId !== props.id) {
    //   // TODO make flux move actions
    //   props.moveCard(dragIndexX, dragIndexY, hoverIndexX, hoverIndexY);
    // }
  }
  // canDrop(props, monitor) {
  //   return true;
  // }
};

// options: 4rd param to dragSource https://gaearon.github.io/react-dnd/docs-drag-source.html
const OPTIONS = {
  arePropsEqual: function arePropsEqual(props, otherProps) {
    let isEqual = true;
    if (props.item.id === otherProps.item.id) {
      isEqual = true;
    } else {
      isEqual = false;
    }
    return isEqual;
  }
};


function collectDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}


function collectDropTarget(connect, monitor, component) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

export default dragSource('card', cardSource, collectDragSource, OPTIONS)(CardComponent);

import React from 'react';
import {Konva, Image, Text} from 'react-konva';

// custom component that will handle loading image from url
// you may add more logic here to handle "loading" state
// or if loading is failed
// VERY IMPORTANT NOTES:
// at first we will set image state to null
// and then we will set it to native image instance when it is loaded
class URLImage extends React.Component {
    state = {
        image: null,
        error: undefined
    };
    componentDidMount() {
        this.loadImage();
    }
    componentDidUpdate(oldProps) {
        if (oldProps.src !== this.props.src) {
            this.loadImage();
        }
    }
    componentWillUnmount() {
        this.image.removeEventListener('load', this.handleLoad);
    }
    loadImage() {
        // save to "this" to remove "load" handler on unmount
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener('load', this.handleLoad);
        this.image.addEventListener('error', this.handleError);
    }
    handleLoad = () => {
        // after setState react-konva will update canvas and redraw the layer
        // because "image" property is changed
        this.setState({
            image: this.image,
            error: undefined
        });
        // if you keep same image object during source updates
        // you will have to update layer manually:
        // this.imageNode.getLayer().batchDraw();
    };
    handleError = (err) => {
        this.setState({
            error: "Loading...",
        });
    };
    render() {
        if (this.state.error != undefined) {
            return (
                <Text
                    text={this.state.error}
                    fontSize={20}
                    fill={"red"}
                />
            );
        } else {
            return (
                <Image
                    x={0}
                    y={0}
                    image={this.state.image}
                    scaleX={this.props.scale}
                    scaleY={this.props.scale}
                    ref={node => {
                        this.imageNode = node;
                    }}
                />
            );
        }
    }
}

export default URLImage;

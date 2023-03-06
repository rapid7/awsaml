const RenderIfLoaded = ({ children, isLoaded }) => (isLoaded ? children() : '');

export default RenderIfLoaded;

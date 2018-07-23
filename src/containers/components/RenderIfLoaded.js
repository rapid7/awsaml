export const RenderIfLoaded = ({children, isLoaded}) => isLoaded ? children() : '';

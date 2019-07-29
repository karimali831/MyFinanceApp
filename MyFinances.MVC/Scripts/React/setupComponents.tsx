import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { registerComponent } from '@gbmg/react-bootstrap';

export const setupComponents = () => {

    registerComponent("dev", async (element: HTMLElement) => {
        const { RootComponentChooser } = await import(/* webpackChunkName: "dev" */"./components/RootComponentChooser");
        ReactDOM.render(<RootComponentChooser />, element);
        return true;
    });

    registerComponent("style-guide", async (element: HTMLElement) => {
        const { StyleGuide } = await import(/* webpackChunkName: "style-guide" */ "./components/StyleGuide");
        ReactDOM.render(<StyleGuide />, element);
        return true;
    });
}
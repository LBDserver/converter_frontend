import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormComponent } from './components'

function App() {
  return (
    <div style={divStyle}>
      <h1>IFC Conversion GUI</h1>
      <p>
        This is a graphical user interface to convert your IFC file using the LBDserver conversion API.
        The API convertor relies on multiple existing conversion tools, such as 
          <a href="http://ifcopenshell.org/ifcconvert" target="_blank" rel="noopener noreferrer"> IfcConvert</a> (Thomas Krijnen), 
          <a href="https://github.com/KhronosGroup/COLLADA2GLTF/" target="_blank" rel="noopener noreferrer"> COLLADA2GLTF</a> (KhronosGroup),
          <a href="https://github.com/pipauwel/IFCtoRDF" target="_blank" rel="noopener noreferrer"> IFCtoRDF</a> (Pieter Pauwels) and 
          <a href="https://github.com/jyrkioraskari/IFCtoLBD" target="_blank" rel="noopener noreferrer"> IFCtoLBD</a> (Jyrki Oraskari).
        Your email address will only be used to send you an e-mail when the conversion is ready. 
      </p>
      <FormComponent />
    </div>
  );
}

const divStyle = {
  margin: "10%",
  minHeight: "100vh",
  position: "relative"
}

export default App;

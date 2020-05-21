import React from 'react'
import { importState, exportState } from '../actions'
import { connect } from 'react-redux'

let ImportExport = ({ onImport, onExport, initState}) => (
  <div className="float-right">
        <button type="button" className="btn btn-secondary btn-sm" onClick={()=>onImport(JSON.parse(initState))} >IMPORT </button>
     {   /*
    <label htmlFor="fileUpload" className="btn btn-secondary btn-sm mb-0 mr-1">Import</label>
    <input type="file" id="fileUpload" className="btn btn-secondary btn-sm d-none" onChange={
      event => { 
        //let reader = new FileReader();
        onImport(initState)
       
        reader.onload = (function(file) {
          return function(e) {
            onImport(e.target.result);
          };
        })(event.target.files[0]);
        reader.readAsText(event.target.files[0]);
        }
      } onClick={ event => event.target.value = ""}/>
    */}
    <button type="button" className="btn btn-secondary btn-sm" onClick={onExport} >Export</button>
  </div>
)

const mapStateToProps = (state) => ({
  state: state.present
})

const mapDispatchToProps = ({
  onImport: importState,
  onExport: exportState
})

ImportExport = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportExport)

export default ImportExport

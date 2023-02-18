import $ from 'jquery';
import React from 'react';
import ReactPage from "../modules/ReactPage"

class ReactPageExample extends ReactPage {
  constructor(props) {
      super(props);
      this.init(props.id, props.model, props.template, props.selector);    
      this.className = "listpage";
  }
  render() {
        super.render();
        const buttonStyle = {
            float: 'left',
            marginLeft:'5px',
            marginTop:'5px',
            marginBottom:'10px'
        };
        const btnPrefix = this.props.id+'_btn_';
        const self = utils.pages[this.Id];
        const items = this.state.buttons.map(function(item,index){
            const id = btnPrefix+index.toString();
            const buttonclickhandler = self.model.buttons[index].click;
            
            return <li key={id} id={id} onClick={buttonclickhandler}><span className={item.name}></span>{item.text}</li>;
            });
            
        return <div>
            <ul className="clearfix buttonmenu">
             {items}
            </ul>
             <h2>{this.state.title}</h2>
            { self.handlers.formRenderHanlder!=null? self.handlers.formRenderHanlder(this.state.data):null}
            </div>
  }
  onButtonClick(index, handler) {
      if ($.isFunction(handler))
         this.model.buttons[index].click = handler;
  }
  setFormHandler(handler){
        if ($.isFunction(handler))
            this.handlers.formRenderHanlder = handler;

  }
  changeTitle(value)
  {
      this.component.setState({title:value},()=>{
            console.log('setState', this.state)
        })
  }  
  convertLocaleModel() {
      console.info('apply local lanuages' );
      this.getLocaleLabels('title');
      this.getLocaleLabels('buttons','text');
  }

}

export default ReactPageExample;
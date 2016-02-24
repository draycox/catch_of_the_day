/*
  Add Fish Form
 < AddFishForm />
*/

import React from 'react';

var AddFishForm = React.createClass({
  createFish : function(event) {
    event.preventDefault();
    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value
    }
    this.props.addFish(fish);
    this.refs.fishForm.reset();
  },
  render : function() {
    return (
      <form className='fish-edit' ref='fishForm' onSubmit={this.createFish} >
        <input type='text' ref='name' placeholder='Fish Name' />
        <input type='text' ref='price' placeholder='Fish Price' />
        <select ref='status'>
          <option value='available'>FRESH!</option>
          <option value='unavailable'>SOLD OUT</option>
        </select>
        <textarea type='text' ref='desc' placeholder='Fish Description'></textarea>
        <input type='text' ref='image' placeholder='Please insert picture' />
        <button type='submit'>+ Add Fish </button>
      </form>
    )
  }
});

export default AddFishForm;
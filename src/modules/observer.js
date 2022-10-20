function NewDataObserver() 
{
  this.observers = [] // array of observers functions
}

NewDataObserver.prototype = {
  subscribe: function(fn) 
  {
    this.observers.push(fn)
  },
  unsubscribe: function(fnToRemove)
  {
    this.observers = this.observers.filter(fn => {
      if(fn !== fnToRemove) 
        return fn
    })
  },
  fire: function(newArray) 
  {
    this.observers.forEach(fn => {
      fn(newArray)
    })
  }
}

export const showDataAll = new NewDataObserver();


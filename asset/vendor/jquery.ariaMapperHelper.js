;(function ( $, window, document, undefined ) {
    
    var pluginName = 'ariaMapperHelper',
        headerElements = ['header','hgroup','h1','h2','h3','h4','h5','h6'];

    function Plugin( ) {
        this._name = pluginName;
    }
    
    Plugin.prototype.resolveLabeledBy = function(searchMethod, labelSelectors){
        
        var ele = this;
        
        if(!labelSelectors)
            labelSelectors = headerElements;
        
        if(!searchMethod)
            searchMethod = 'children'
        
        if(typeof labelSelectors != 'array')
            labelSelectors = [labelSelectors]
        
        if(!ele.attr('aria-labeledby')){
            var children = $(labelSelectors).filter(function(){ return ele[searchMethod](this.toString()).length > 0 }).get()
            if(children.length > 0){
                ele[pluginName]('setLabeledBy', ele[searchMethod](children[0]).first());
            }
        }
    }
    
    Plugin.prototype.setLabeledBy = function(label){
        if(this.attr('aria-labeledby'))
            return;
        if(label.attr('id') == undefined)
            label.attr('id', "aria-"+Math.random().toString(36).substring(2));
        this.attr('aria-labeledby',label.attr('id'))
    }
    
    $.fn[pluginName] = function ( operation ) {
        var args = Array.prototype.slice.call(arguments).slice(1);
        return this.each(function () {
            (new Plugin)[operation].apply($(this), args);
        });
    }
    

})( jQuery, window, document );
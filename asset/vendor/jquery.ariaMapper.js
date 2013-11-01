;(function ( $, window, document, undefined ) {
    
    var pluginName = 'ariaMapper';
    
    var sectionElements = ['article','section','nav','aside','h1','h2','h3','h4','h5','h6','header','footer','main'];
    
    var regionRoles = ['alert','alertdialog','application','article','banner','complementary','contentinfo','directory','form','grid','list','log','main','navigation','region','search','status','tabpanel','tablist','timer','treegrid'];
        
        // Default options
    var defaults = {
            "polyfill": true,
            "roles": {
                "polyfill":null,
                "polyfills": {
                    "selectors": {
                        "banner": "header:not("+sectionElements.join(' header):not(')+" header)",
                        "contentinfo": "footer:not("+sectionElements.join(' footer):not(')+" footer)",
                        "main": "main",
                        "article": "article",
                        "complementary": "aside:not(main aside)",
                        "navigation": "nav",
                        "region": "section"
                    },
                    "callbacks": {
                    },
                    "filters": {},
                    "exclusions": []
                },
                "selectors": {},
                "filters": {},
                "callbacks": {},
                "exclusions": []
            },
            "labeledby": {
                "roles": {}, // values filled in below
                "selectors": {}
            }
        };
        
    $(regionRoles).each(function(){
        defaults.labeledby.roles[this.toString()] = true;
    })

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( true, {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
    }

    Plugin.prototype.run = function () {
        
        var plugin = this,
            element = this.element,
            options = this.options,
            
            roles = {},
            
            onlyOnceWithRole = ['banner','contentinfo','main'],
            selected,
            
            roleFilters = $.extend({}, options.roles.polyfills.filters, options.roles.filters),
            roleCallbacks = $.extend({}, options.roles.polyfills.callbacks, options.roles.callbacks),
            labeledbySelectors = options.labeledby.selectors;
    
        jQuery.each(options.roles.selectors, function(k, v){
            roles[k] = jQuery.isArray(v) ? v : [v] 
        });
        
        if(options.roles.polyfill || options.polyfill && options.roles.polyfill !== false){
            
            jQuery.each(options.roles.polyfills.selectors, function(k,v){ 
                if(options.roles.polyfills.exclusions.indexOf(k) < 0){
                    if(!roles[k]){
                        roles[k] = jQuery.isArray(v) ? v : [v]
                    }else{
                        jQuery.merge(roles[k], jQuery.isArray(v) ? v : [v]) 
                    }
                }
            });
            
        }
        
        // add labeledby roles to selector list
        $.each(options.labeledby.roles, function(role,included){
            if(included)
                labeledbySelectors['[role="'+role+'"]'] = true
        })
        
        $.each(roles, function(name, selectors){
            
            if(options.roles.exclusions.indexOf(name) < 0){
                
                selected = $(element).find(selectors.join(', ')).filter(function(){ return $(this).attr('role') === undefined })
                
                if(roleFilters[name])
                    selected = selected.filter(function(){ 
                        var ele = $(this);
                        ele.super = function(){
                            if(options.roles.polyfill || options.polyfill && options.roles.polyfill !== false)
                                if(options.roles.polyfills.filters[name] && options.roles.polyfills.exclusions.indexOf(name) < 0)
                                    return options.roles.polyfills.filters[name].call(ele);
                        }
                        return roleFilters[name].call(ele) 
                    });
                
                if(onlyOnceWithRole.indexOf(name) >= 0 && (selected.length + $(element).find('[role="'+name+'"]').length > 1))
                    return;
                
                selected.attr('role',name);
                
                if(roleCallbacks[name])
                    $('[role="'+name+'"]').each(function(){
                        var ele = $(this);
                        ele.super = function(){
                            if(options.roles.polyfill || options.polyfill && options.roles.polyfill !== false)
                                if(options.roles.polyfills.callbacks[name] && options.roles.polyfills.exclusions.indexOf(name) < 0)
                                    options.roles.polyfills.callbacks[name].call(ele);
                        }
                        roleCallbacks[name].call(ele)
                    })
            }
        })
        
        $.each(labeledbySelectors, function(selector, operation){
            if(operation === true) // use default operation
                operation = function(){ this.ariaMapperHelper('resolveLabeledBy') };
            operation.call($(element).find(selector))
        })
        
    };
    
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            (new Plugin(this, options)).run();
        });
    }
    

})( jQuery, window, document );
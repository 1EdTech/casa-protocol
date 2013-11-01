var VIEWER = new function(){
    
    this.page = false;
    
    this.go = function(name, fade){

        var page,
            viewer = this,
            fadeTime = typeof fade == 'undefined' ? 400 : parseInt(fade),
            anchor;
        name = name.toLowerCase().split(':')
        if(name.length > 1){
            anchor = name[1];
            name = name[0];
        }else{
            name = name[0];
            anchor = false;
        }

        if(name != this.page){
            
            $('#content, #colophon').fadeOut(fadeTime, function(){

                $('#content').html('');

                viewer.page = name;

                try{
                    page = new EJS({url: 'page/'+name+'.ejs'});
                }catch(e){
                    page = new EJS({url: 'page/error/404.ejs'});
                }

                $('#content').append(page.render(viewer));
                $('#content > :not(header)').find('h1').each(function(){
                    var ref = $(this).text().toLowerCase().replace(/ /g,'_');
                    var count = false;
                    if($('#s-'+ref).length > 0){
                        count = 1;
                        while($('#s-'+ref+'_'+count).length > 0)
                            count++;
                    }
                    if(count){
                        $(this).attr('id', 's-'+ref+'_'+count);
                    }else{
                        $(this).attr('id', 's-'+ref);
                    }
                })

                $('#content a:not([rel="external"])').each(function(){
                    var href = $(this).attr('href');
                    if(href){
                        href = href.replace('#',':')
                        console.log(href)
                        if(href.indexOf(':') === 0){
                            href = name+href;
                        }
                        href = '#'+href;
                        $(this).attr('href',href);
                    }
                })

                $('#content').ariaMapper();
                
                var statuses = {
                    'non-normative': 'This section is non-normative',
                    'conflict': 'This section is flagged as in conflict',
                    'revision': 'This section is flagged for revision',
                    'incomplete': 'This section is flagged as incomplete'
                };
                var issueStatuses = ['conflict','revision','incomplete'];
                
                // requires aria mappings
                $('[data-status]').each(function(){
                    var status = $(this).attr('data-status')
                    if(statuses[status]){
                        $(this).addClass('status_section').addClass(status);
                        if($.inArray(status, issueStatuses) >= 0)
                            $(this).addClass('issue')
                        var str  = '<footer role="status" class="status_message">';
                        str += '<h1>'+statuses[status]+'</h1>';
                        if($(this).attr('data-message'))
                            str += $(this).attr('data-message');
                        str += '</footer>';
                        if($(this).find('#'+$(this).attr('aria-labeledby')).length)
                            $(this).find('#'+$(this).attr('aria-labeledby')).after(str)
                        else
                            $(this).addClass('no-header').prepend(str)
                    }
                });


                document.title = $('#content > header > *:not(hgroup), #content > header > hgroup > *').map(function(){ 
                    return $(this).text().replace('Community App Sharing Architecture','CASA'); 
                }).get().join(' - ');

                prettyPrint();
                $('body').scrollTop(0)


                $('#content, #colophon').fadeIn(fadeTime, function(){
                    if(anchor && $('#s-'+anchor).length > 0){
                        $("html,body").animate({ scrollTop: $('#s-'+anchor).position().top-25 }, "slow")
                    }
                });
                
                $('#hide_non-normative').change();
                $('#show_issues-only').change();
            
            });
        
        }else{
            
            if(anchor && $('#s-'+anchor).length > 0){
                $("html,body").animate({ scrollTop: $('#s-'+anchor).position().top }, "slow")
            }
            
        }
    };
    
}
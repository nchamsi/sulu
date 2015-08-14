define(["widget-groups","services/sulucontact/account-manager","services/sulucontact/contact-manager","services/sulucontact/contact-delete-dialog"],function(a,b,c,d){"use strict";return{view:!0,layout:function(){return{content:{width:"fixed"},sidebar:{width:"max",cssClasses:"sidebar-padding-50"}}},templates:["/admin/contact/template/basic/documents"],initialize:function(){this.manager="contact"===this.options.type?c:b,this.manager.loadOrNew(this.options.id).then(function(b){this.data=b,this.currentSelection=this.sandbox.util.arrayGetColumn(this.data.medias,"id"),this.bindCustomEvents(),this.render(),this.options&&this.options.id&&("contact"===this.options.type&&a.exists("contact-detail")?this.initSidebar("/admin/widget-groups/contact-detail?contact=",this.options.id):"account"===this.options.type&&a.exists("account-detail")&&this.initSidebar("/admin/widget-groups/account-detail?account=",this.options.id))}.bind(this))},initSidebar:function(a,b){this.sandbox.emit("sulu.sidebar.set-widget",a+b)},render:function(){this.html(this.renderTemplate(this.templates[0])),this.startSelectionOverlay(),this.initList()},bindCustomEvents:function(){this.sandbox.on("husky.datagrid.documents.number.selections",function(a){var b=a>0?"enable":"disable";this.sandbox.emit("husky.toolbar.documents.item."+b,"deleteSelected",!1)},this),this.sandbox.on("sulu.contacts.document.removed",function(a,b){this.sandbox.emit("husky.datagrid.documents.record.remove",b)}.bind(this)),this.sandbox.on("sulu.media-selection-overlay.documents.record-selected",this.addItem.bind(this)),this.sandbox.on("sulu.media-selection-overlay.documents.record-deselected",this.removeItem.bind(this))},addItem:function(a,b){-1===this.currentSelection.indexOf(a)&&(this.sandbox.emit("husky.datagrid.documents.record.add",b),this.manager.addDocument(this.options.id,a).then(function(){this.currentSelection.push(a)}.bind(this)))},removeItem:function(a){this.manager.removeDocument(this.options.id,a).then(function(){this.currentSelection=this.sandbox.util.removeFromArray(this.currentSelection,[a])}.bind(this))},showAddOverlay:function(){this.sandbox.emit("sulu.media-selection-overlay.documents.set-selected",this.currentSelection),this.sandbox.emit("sulu.media-selection-overlay.documents.open")},removeSelected:function(){this.sandbox.emit("husky.datagrid.documents.items.get-selected",function(a){d.showDialog(a,function(){this.currentSelection=this.sandbox.util.removeFromArray(this.currentSelection,a),this.manager.removeDocuments(this.options.id,a)}.bind(this))}.bind(this))},initList:function(){var a=this.manager.getDocumentsData(this.options.id);this.sandbox.sulu.initListToolbarAndList.call(this,a.fieldsKey,a.fieldsUrl,{el:this.$find("#list-toolbar-container"),instanceName:"documents",template:this.getListTemplate(),hasSearch:!0},{el:this.$find("#documents-list"),url:a.listUrl,searchInstanceName:"documents",instanceName:"documents",resultKey:"media",searchFields:["name","title","description"],viewOptions:{table:{selectItem:{type:"checkbox"}}}})},getListTemplate:function(){return this.sandbox.sulu.buttons.get({add:{options:{callback:this.showAddOverlay.bind(this)}},deleteSelected:{options:{callback:this.removeSelected.bind(this)}}})},startSelectionOverlay:function(){var a=this.sandbox.dom.createElement("<div/>");this.sandbox.dom.append(this.$el,a),this.sandbox.start([{name:"media-selection-overlay@sulumedia",options:{el:a,instanceName:"documents",preselectedIds:this.currentSelection}}])}}});
'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">server documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ActivitiesModule.html" data-type="entity-link" >ActivitiesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ActivitiesModule-861b9526e40f8c07d2849531a31debcc36d2cea644a0384e15a7eba78c8ccd60a6dd516d6a2ffa325ea738639b1f0e4fc85e4cc302c58bf956d52cf12446172e"' : 'data-target="#xs-controllers-links-module-ActivitiesModule-861b9526e40f8c07d2849531a31debcc36d2cea644a0384e15a7eba78c8ccd60a6dd516d6a2ffa325ea738639b1f0e4fc85e4cc302c58bf956d52cf12446172e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ActivitiesModule-861b9526e40f8c07d2849531a31debcc36d2cea644a0384e15a7eba78c8ccd60a6dd516d6a2ffa325ea738639b1f0e4fc85e4cc302c58bf956d52cf12446172e"' :
                                            'id="xs-controllers-links-module-ActivitiesModule-861b9526e40f8c07d2849531a31debcc36d2cea644a0384e15a7eba78c8ccd60a6dd516d6a2ffa325ea738639b1f0e4fc85e4cc302c58bf956d52cf12446172e"' }>
                                            <li class="link">
                                                <a href="controllers/ActivitiesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActivitiesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ActivitiesModule-861b9526e40f8c07d2849531a31debcc36d2cea644a0384e15a7eba78c8ccd60a6dd516d6a2ffa325ea738639b1f0e4fc85e4cc302c58bf956d52cf12446172e"' : 'data-target="#xs-injectables-links-module-ActivitiesModule-861b9526e40f8c07d2849531a31debcc36d2cea644a0384e15a7eba78c8ccd60a6dd516d6a2ffa325ea738639b1f0e4fc85e4cc302c58bf956d52cf12446172e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ActivitiesModule-861b9526e40f8c07d2849531a31debcc36d2cea644a0384e15a7eba78c8ccd60a6dd516d6a2ffa325ea738639b1f0e4fc85e4cc302c58bf956d52cf12446172e"' :
                                        'id="xs-injectables-links-module-ActivitiesModule-861b9526e40f8c07d2849531a31debcc36d2cea644a0384e15a7eba78c8ccd60a6dd516d6a2ffa325ea738639b1f0e4fc85e4cc302c58bf956d52cf12446172e"' }>
                                        <li class="link">
                                            <a href="injectables/ActivitiesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActivitiesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AddressModule.html" data-type="entity-link" >AddressModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AddressModule-0891b2761241238beebe9be41e60d6f875c186c9e3d7cd74587f724fd5ffb682511b941e4b29c0cce14231ac4e389d50339d48d96462bce49a8a4a39c96cb755"' : 'data-target="#xs-controllers-links-module-AddressModule-0891b2761241238beebe9be41e60d6f875c186c9e3d7cd74587f724fd5ffb682511b941e4b29c0cce14231ac4e389d50339d48d96462bce49a8a4a39c96cb755"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AddressModule-0891b2761241238beebe9be41e60d6f875c186c9e3d7cd74587f724fd5ffb682511b941e4b29c0cce14231ac4e389d50339d48d96462bce49a8a4a39c96cb755"' :
                                            'id="xs-controllers-links-module-AddressModule-0891b2761241238beebe9be41e60d6f875c186c9e3d7cd74587f724fd5ffb682511b941e4b29c0cce14231ac4e389d50339d48d96462bce49a8a4a39c96cb755"' }>
                                            <li class="link">
                                                <a href="controllers/AddressController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddressController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/EventController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RespondedController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RespondedController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AddressModule-0891b2761241238beebe9be41e60d6f875c186c9e3d7cd74587f724fd5ffb682511b941e4b29c0cce14231ac4e389d50339d48d96462bce49a8a4a39c96cb755"' : 'data-target="#xs-injectables-links-module-AddressModule-0891b2761241238beebe9be41e60d6f875c186c9e3d7cd74587f724fd5ffb682511b941e4b29c0cce14231ac4e389d50339d48d96462bce49a8a4a39c96cb755"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AddressModule-0891b2761241238beebe9be41e60d6f875c186c9e3d7cd74587f724fd5ffb682511b941e4b29c0cce14231ac4e389d50339d48d96462bce49a8a4a39c96cb755"' :
                                        'id="xs-injectables-links-module-AddressModule-0891b2761241238beebe9be41e60d6f875c186c9e3d7cd74587f724fd5ffb682511b941e4b29c0cce14231ac4e389d50339d48d96462bce49a8a4a39c96cb755"' }>
                                        <li class="link">
                                            <a href="injectables/AddressService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddressService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-5d50e96f5e0659622241707865099c13afbfe365fbbdd6d397013fef0b5e8084c020fb4db3f1fda47034521c308162b83e69ccc11b527b251f3cb08863efebc0"' : 'data-target="#xs-injectables-links-module-AuthModule-5d50e96f5e0659622241707865099c13afbfe365fbbdd6d397013fef0b5e8084c020fb4db3f1fda47034521c308162b83e69ccc11b527b251f3cb08863efebc0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-5d50e96f5e0659622241707865099c13afbfe365fbbdd6d397013fef0b5e8084c020fb4db3f1fda47034521c308162b83e69ccc11b527b251f3cb08863efebc0"' :
                                        'id="xs-injectables-links-module-AuthModule-5d50e96f5e0659622241707865099c13afbfe365fbbdd6d397013fef0b5e8084c020fb4db3f1fda47034521c308162b83e69ccc11b527b251f3cb08863efebc0"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChatsModule.html" data-type="entity-link" >ChatsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ChatsModule-0b529015d24d30f94992f081310e917c858e1c8e5fae6c584c930d3bde62a46cefc926a851c4662351c1cb5adf05be9dfb270c32d19b5be074a037f36d1474af"' : 'data-target="#xs-controllers-links-module-ChatsModule-0b529015d24d30f94992f081310e917c858e1c8e5fae6c584c930d3bde62a46cefc926a851c4662351c1cb5adf05be9dfb270c32d19b5be074a037f36d1474af"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ChatsModule-0b529015d24d30f94992f081310e917c858e1c8e5fae6c584c930d3bde62a46cefc926a851c4662351c1cb5adf05be9dfb270c32d19b5be074a037f36d1474af"' :
                                            'id="xs-controllers-links-module-ChatsModule-0b529015d24d30f94992f081310e917c858e1c8e5fae6c584c930d3bde62a46cefc926a851c4662351c1cb5adf05be9dfb270c32d19b5be074a037f36d1474af"' }>
                                            <li class="link">
                                                <a href="controllers/ChatsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ChatsModule-0b529015d24d30f94992f081310e917c858e1c8e5fae6c584c930d3bde62a46cefc926a851c4662351c1cb5adf05be9dfb270c32d19b5be074a037f36d1474af"' : 'data-target="#xs-injectables-links-module-ChatsModule-0b529015d24d30f94992f081310e917c858e1c8e5fae6c584c930d3bde62a46cefc926a851c4662351c1cb5adf05be9dfb270c32d19b5be074a037f36d1474af"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ChatsModule-0b529015d24d30f94992f081310e917c858e1c8e5fae6c584c930d3bde62a46cefc926a851c4662351c1cb5adf05be9dfb270c32d19b5be074a037f36d1474af"' :
                                        'id="xs-injectables-links-module-ChatsModule-0b529015d24d30f94992f081310e917c858e1c8e5fae6c584c930d3bde62a46cefc926a851c4662351c1cb5adf05be9dfb270c32d19b5be074a037f36d1474af"' }>
                                        <li class="link">
                                            <a href="injectables/ChatsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoursesModule.html" data-type="entity-link" >CoursesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CoursesModule-f2e84035cd7850f4abd8cff7b7ece46269183c4da769413f7c6eae30e6434f431b179731547b43c86847cadf03df816766d4802c40b3660fdfc5d30c58cbe928"' : 'data-target="#xs-controllers-links-module-CoursesModule-f2e84035cd7850f4abd8cff7b7ece46269183c4da769413f7c6eae30e6434f431b179731547b43c86847cadf03df816766d4802c40b3660fdfc5d30c58cbe928"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CoursesModule-f2e84035cd7850f4abd8cff7b7ece46269183c4da769413f7c6eae30e6434f431b179731547b43c86847cadf03df816766d4802c40b3660fdfc5d30c58cbe928"' :
                                            'id="xs-controllers-links-module-CoursesModule-f2e84035cd7850f4abd8cff7b7ece46269183c4da769413f7c6eae30e6434f431b179731547b43c86847cadf03df816766d4802c40b3660fdfc5d30c58cbe928"' }>
                                            <li class="link">
                                                <a href="controllers/CertificateController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CertificateController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/CourseController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CourseController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/LessonController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LessonController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoursesModule-f2e84035cd7850f4abd8cff7b7ece46269183c4da769413f7c6eae30e6434f431b179731547b43c86847cadf03df816766d4802c40b3660fdfc5d30c58cbe928"' : 'data-target="#xs-injectables-links-module-CoursesModule-f2e84035cd7850f4abd8cff7b7ece46269183c4da769413f7c6eae30e6434f431b179731547b43c86847cadf03df816766d4802c40b3660fdfc5d30c58cbe928"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoursesModule-f2e84035cd7850f4abd8cff7b7ece46269183c4da769413f7c6eae30e6434f431b179731547b43c86847cadf03df816766d4802c40b3660fdfc5d30c58cbe928"' :
                                        'id="xs-injectables-links-module-CoursesModule-f2e84035cd7850f4abd8cff7b7ece46269183c4da769413f7c6eae30e6434f431b179731547b43c86847cadf03df816766d4802c40b3660fdfc5d30c58cbe928"' }>
                                        <li class="link">
                                            <a href="injectables/CourseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CourseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LessonService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LessonService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ForumModule.html" data-type="entity-link" >ForumModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ForumModule-a825392808c334cf1f7c12338db08c751a9573fd27882c7d7f952884d9a1ea896c8d86917c4eadd00d96bcf181c73085cf137b4d6f7e0e8bc299344165926ec4"' : 'data-target="#xs-controllers-links-module-ForumModule-a825392808c334cf1f7c12338db08c751a9573fd27882c7d7f952884d9a1ea896c8d86917c4eadd00d96bcf181c73085cf137b4d6f7e0e8bc299344165926ec4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ForumModule-a825392808c334cf1f7c12338db08c751a9573fd27882c7d7f952884d9a1ea896c8d86917c4eadd00d96bcf181c73085cf137b4d6f7e0e8bc299344165926ec4"' :
                                            'id="xs-controllers-links-module-ForumModule-a825392808c334cf1f7c12338db08c751a9573fd27882c7d7f952884d9a1ea896c8d86917c4eadd00d96bcf181c73085cf137b4d6f7e0e8bc299344165926ec4"' }>
                                            <li class="link">
                                                <a href="controllers/BlogController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlogController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ReplyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReplyController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/VoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ForumModule-a825392808c334cf1f7c12338db08c751a9573fd27882c7d7f952884d9a1ea896c8d86917c4eadd00d96bcf181c73085cf137b4d6f7e0e8bc299344165926ec4"' : 'data-target="#xs-injectables-links-module-ForumModule-a825392808c334cf1f7c12338db08c751a9573fd27882c7d7f952884d9a1ea896c8d86917c4eadd00d96bcf181c73085cf137b4d6f7e0e8bc299344165926ec4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ForumModule-a825392808c334cf1f7c12338db08c751a9573fd27882c7d7f952884d9a1ea896c8d86917c4eadd00d96bcf181c73085cf137b4d6f7e0e8bc299344165926ec4"' :
                                        'id="xs-injectables-links-module-ForumModule-a825392808c334cf1f7c12338db08c751a9573fd27882c7d7f952884d9a1ea896c8d86917c4eadd00d96bcf181c73085cf137b4d6f7e0e8bc299344165926ec4"' }>
                                        <li class="link">
                                            <a href="injectables/BlogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReplyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReplyService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VoteService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoteService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GroupModule.html" data-type="entity-link" >GroupModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-GroupModule-d4e0786c902fa98910a4035dcee665c14bc7642645e9aad99ca783e9bc4c881e5a8fe30c2a0a681311378d07c33c3309068ae4c299b60c5946411487b56edb2a"' : 'data-target="#xs-controllers-links-module-GroupModule-d4e0786c902fa98910a4035dcee665c14bc7642645e9aad99ca783e9bc4c881e5a8fe30c2a0a681311378d07c33c3309068ae4c299b60c5946411487b56edb2a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GroupModule-d4e0786c902fa98910a4035dcee665c14bc7642645e9aad99ca783e9bc4c881e5a8fe30c2a0a681311378d07c33c3309068ae4c299b60c5946411487b56edb2a"' :
                                            'id="xs-controllers-links-module-GroupModule-d4e0786c902fa98910a4035dcee665c14bc7642645e9aad99ca783e9bc4c881e5a8fe30c2a0a681311378d07c33c3309068ae4c299b60c5946411487b56edb2a"' }>
                                            <li class="link">
                                                <a href="controllers/GroupController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/MemberController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MemberController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GroupModule-d4e0786c902fa98910a4035dcee665c14bc7642645e9aad99ca783e9bc4c881e5a8fe30c2a0a681311378d07c33c3309068ae4c299b60c5946411487b56edb2a"' : 'data-target="#xs-injectables-links-module-GroupModule-d4e0786c902fa98910a4035dcee665c14bc7642645e9aad99ca783e9bc4c881e5a8fe30c2a0a681311378d07c33c3309068ae4c299b60c5946411487b56edb2a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GroupModule-d4e0786c902fa98910a4035dcee665c14bc7642645e9aad99ca783e9bc4c881e5a8fe30c2a0a681311378d07c33c3309068ae4c299b60c5946411487b56edb2a"' :
                                        'id="xs-injectables-links-module-GroupModule-d4e0786c902fa98910a4035dcee665c14bc7642645e9aad99ca783e9bc4c881e5a8fe30c2a0a681311378d07c33c3309068ae4c299b60c5946411487b56edb2a"' }>
                                        <li class="link">
                                            <a href="injectables/GroupService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MemberService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MemberService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/JobsModule.html" data-type="entity-link" >JobsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-JobsModule-37d26bde406d1d01f343d0fad31579ededf2314073f96ff1f79cd2285c48c8c4e18ca95d344cb87118d9993cf61665d96ae3a3997cb2ae79673c36c7d0284c77"' : 'data-target="#xs-controllers-links-module-JobsModule-37d26bde406d1d01f343d0fad31579ededf2314073f96ff1f79cd2285c48c8c4e18ca95d344cb87118d9993cf61665d96ae3a3997cb2ae79673c36c7d0284c77"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-JobsModule-37d26bde406d1d01f343d0fad31579ededf2314073f96ff1f79cd2285c48c8c4e18ca95d344cb87118d9993cf61665d96ae3a3997cb2ae79673c36c7d0284c77"' :
                                            'id="xs-controllers-links-module-JobsModule-37d26bde406d1d01f343d0fad31579ededf2314073f96ff1f79cd2285c48c8c4e18ca95d344cb87118d9993cf61665d96ae3a3997cb2ae79673c36c7d0284c77"' }>
                                            <li class="link">
                                                <a href="controllers/ApplicantController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApplicantController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/JobsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JobsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ResumeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResumeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-JobsModule-37d26bde406d1d01f343d0fad31579ededf2314073f96ff1f79cd2285c48c8c4e18ca95d344cb87118d9993cf61665d96ae3a3997cb2ae79673c36c7d0284c77"' : 'data-target="#xs-injectables-links-module-JobsModule-37d26bde406d1d01f343d0fad31579ededf2314073f96ff1f79cd2285c48c8c4e18ca95d344cb87118d9993cf61665d96ae3a3997cb2ae79673c36c7d0284c77"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-JobsModule-37d26bde406d1d01f343d0fad31579ededf2314073f96ff1f79cd2285c48c8c4e18ca95d344cb87118d9993cf61665d96ae3a3997cb2ae79673c36c7d0284c77"' :
                                        'id="xs-injectables-links-module-JobsModule-37d26bde406d1d01f343d0fad31579ededf2314073f96ff1f79cd2285c48c8c4e18ca95d344cb87118d9993cf61665d96ae3a3997cb2ae79673c36c7d0284c77"' }>
                                        <li class="link">
                                            <a href="injectables/ApplicantService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApplicantService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JobsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JobsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResumeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResumeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PackagesModule.html" data-type="entity-link" >PackagesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PackagesModule-c8132265276484f1cf7d695d3d679d41820f2992143d4fc344a3a15f9b2407e276b336cb3b213d942369a9502d17d9e408a311d3125382f3ef27380fae3f150c"' : 'data-target="#xs-controllers-links-module-PackagesModule-c8132265276484f1cf7d695d3d679d41820f2992143d4fc344a3a15f9b2407e276b336cb3b213d942369a9502d17d9e408a311d3125382f3ef27380fae3f150c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PackagesModule-c8132265276484f1cf7d695d3d679d41820f2992143d4fc344a3a15f9b2407e276b336cb3b213d942369a9502d17d9e408a311d3125382f3ef27380fae3f150c"' :
                                            'id="xs-controllers-links-module-PackagesModule-c8132265276484f1cf7d695d3d679d41820f2992143d4fc344a3a15f9b2407e276b336cb3b213d942369a9502d17d9e408a311d3125382f3ef27380fae3f150c"' }>
                                            <li class="link">
                                                <a href="controllers/PackagesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PackagesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PackagesModule-c8132265276484f1cf7d695d3d679d41820f2992143d4fc344a3a15f9b2407e276b336cb3b213d942369a9502d17d9e408a311d3125382f3ef27380fae3f150c"' : 'data-target="#xs-injectables-links-module-PackagesModule-c8132265276484f1cf7d695d3d679d41820f2992143d4fc344a3a15f9b2407e276b336cb3b213d942369a9502d17d9e408a311d3125382f3ef27380fae3f150c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PackagesModule-c8132265276484f1cf7d695d3d679d41820f2992143d4fc344a3a15f9b2407e276b336cb3b213d942369a9502d17d9e408a311d3125382f3ef27380fae3f150c"' :
                                        'id="xs-injectables-links-module-PackagesModule-c8132265276484f1cf7d695d3d679d41820f2992143d4fc344a3a15f9b2407e276b336cb3b213d942369a9502d17d9e408a311d3125382f3ef27380fae3f150c"' }>
                                        <li class="link">
                                            <a href="injectables/PackagesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PackagesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PostModule.html" data-type="entity-link" >PostModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PostModule-f9192e675b12bf0bcd65a3ec0bca3083d6c2000618dcb886409e44d66d894eaff62e089716cc78a25e1c3c0683f10ee64806ff2294198d39b9abfe287e000f69"' : 'data-target="#xs-controllers-links-module-PostModule-f9192e675b12bf0bcd65a3ec0bca3083d6c2000618dcb886409e44d66d894eaff62e089716cc78a25e1c3c0683f10ee64806ff2294198d39b9abfe287e000f69"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PostModule-f9192e675b12bf0bcd65a3ec0bca3083d6c2000618dcb886409e44d66d894eaff62e089716cc78a25e1c3c0683f10ee64806ff2294198d39b9abfe287e000f69"' :
                                            'id="xs-controllers-links-module-PostModule-f9192e675b12bf0bcd65a3ec0bca3083d6c2000618dcb886409e44d66d894eaff62e089716cc78a25e1c3c0683f10ee64806ff2294198d39b9abfe287e000f69"' }>
                                            <li class="link">
                                                <a href="controllers/CommentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PostController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ReactController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReactController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PostModule-f9192e675b12bf0bcd65a3ec0bca3083d6c2000618dcb886409e44d66d894eaff62e089716cc78a25e1c3c0683f10ee64806ff2294198d39b9abfe287e000f69"' : 'data-target="#xs-injectables-links-module-PostModule-f9192e675b12bf0bcd65a3ec0bca3083d6c2000618dcb886409e44d66d894eaff62e089716cc78a25e1c3c0683f10ee64806ff2294198d39b9abfe287e000f69"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PostModule-f9192e675b12bf0bcd65a3ec0bca3083d6c2000618dcb886409e44d66d894eaff62e089716cc78a25e1c3c0683f10ee64806ff2294198d39b9abfe287e000f69"' :
                                        'id="xs-injectables-links-module-PostModule-f9192e675b12bf0bcd65a3ec0bca3083d6c2000618dcb886409e44d66d894eaff62e089716cc78a25e1c3c0683f10ee64806ff2294198d39b9abfe287e000f69"' }>
                                        <li class="link">
                                            <a href="injectables/CommentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PostService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReactService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReactService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TagService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ProfileModule-957f2a9fad14f5ffb22a25dc6094e9f8c1b9609a7954c552614b2fcc71ac8d8f1eeb9161efffe2bd6ba57e6dadf64db08f450c6e3a54cad27b738d90a4061f7a"' : 'data-target="#xs-controllers-links-module-ProfileModule-957f2a9fad14f5ffb22a25dc6094e9f8c1b9609a7954c552614b2fcc71ac8d8f1eeb9161efffe2bd6ba57e6dadf64db08f450c6e3a54cad27b738d90a4061f7a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-957f2a9fad14f5ffb22a25dc6094e9f8c1b9609a7954c552614b2fcc71ac8d8f1eeb9161efffe2bd6ba57e6dadf64db08f450c6e3a54cad27b738d90a4061f7a"' :
                                            'id="xs-controllers-links-module-ProfileModule-957f2a9fad14f5ffb22a25dc6094e9f8c1b9609a7954c552614b2fcc71ac8d8f1eeb9161efffe2bd6ba57e6dadf64db08f450c6e3a54cad27b738d90a4061f7a"' }>
                                            <li class="link">
                                                <a href="controllers/PageController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RelationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RelationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProfileModule-957f2a9fad14f5ffb22a25dc6094e9f8c1b9609a7954c552614b2fcc71ac8d8f1eeb9161efffe2bd6ba57e6dadf64db08f450c6e3a54cad27b738d90a4061f7a"' : 'data-target="#xs-injectables-links-module-ProfileModule-957f2a9fad14f5ffb22a25dc6094e9f8c1b9609a7954c552614b2fcc71ac8d8f1eeb9161efffe2bd6ba57e6dadf64db08f450c6e3a54cad27b738d90a4061f7a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfileModule-957f2a9fad14f5ffb22a25dc6094e9f8c1b9609a7954c552614b2fcc71ac8d8f1eeb9161efffe2bd6ba57e6dadf64db08f450c6e3a54cad27b738d90a4061f7a"' :
                                        'id="xs-injectables-links-module-ProfileModule-957f2a9fad14f5ffb22a25dc6094e9f8c1b9609a7954c552614b2fcc71ac8d8f1eeb9161efffe2bd6ba57e6dadf64db08f450c6e3a54cad27b738d90a4061f7a"' }>
                                        <li class="link">
                                            <a href="injectables/PageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RelationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RelationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingModule.html" data-type="entity-link" >SettingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SettingModule-d1ebf53ff96b3b08684a542c3f29363862453c0ed97616b98cd2e2b05b038b7d2e488f291404091aeb1daebb63747abda4a14bedea1b2705d15ba095a8647f1e"' : 'data-target="#xs-controllers-links-module-SettingModule-d1ebf53ff96b3b08684a542c3f29363862453c0ed97616b98cd2e2b05b038b7d2e488f291404091aeb1daebb63747abda4a14bedea1b2705d15ba095a8647f1e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SettingModule-d1ebf53ff96b3b08684a542c3f29363862453c0ed97616b98cd2e2b05b038b7d2e488f291404091aeb1daebb63747abda4a14bedea1b2705d15ba095a8647f1e"' :
                                            'id="xs-controllers-links-module-SettingModule-d1ebf53ff96b3b08684a542c3f29363862453c0ed97616b98cd2e2b05b038b7d2e488f291404091aeb1daebb63747abda4a14bedea1b2705d15ba095a8647f1e"' }>
                                            <li class="link">
                                                <a href="controllers/CategoryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoryController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PolicyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PolicyController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ReportController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReportController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SettingModule-d1ebf53ff96b3b08684a542c3f29363862453c0ed97616b98cd2e2b05b038b7d2e488f291404091aeb1daebb63747abda4a14bedea1b2705d15ba095a8647f1e"' : 'data-target="#xs-injectables-links-module-SettingModule-d1ebf53ff96b3b08684a542c3f29363862453c0ed97616b98cd2e2b05b038b7d2e488f291404091aeb1daebb63747abda4a14bedea1b2705d15ba095a8647f1e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SettingModule-d1ebf53ff96b3b08684a542c3f29363862453c0ed97616b98cd2e2b05b038b7d2e488f291404091aeb1daebb63747abda4a14bedea1b2705d15ba095a8647f1e"' :
                                        'id="xs-injectables-links-module-SettingModule-d1ebf53ff96b3b08684a542c3f29363862453c0ed97616b98cd2e2b05b038b7d2e488f291404091aeb1daebb63747abda4a14bedea1b2705d15ba095a8647f1e"' }>
                                        <li class="link">
                                            <a href="injectables/CategoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ShopModule.html" data-type="entity-link" >ShopModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ShopModule-f363e39fbf4749a8f5d6ac2a28faabd42a4f8b944cf332ca863a36fa34cc81a91a6bcdb338de13d1952e3d6e3069741804ec7fe23c4185aa2b0aca71978152fa"' : 'data-target="#xs-controllers-links-module-ShopModule-f363e39fbf4749a8f5d6ac2a28faabd42a4f8b944cf332ca863a36fa34cc81a91a6bcdb338de13d1952e3d6e3069741804ec7fe23c4185aa2b0aca71978152fa"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ShopModule-f363e39fbf4749a8f5d6ac2a28faabd42a4f8b944cf332ca863a36fa34cc81a91a6bcdb338de13d1952e3d6e3069741804ec7fe23c4185aa2b0aca71978152fa"' :
                                            'id="xs-controllers-links-module-ShopModule-f363e39fbf4749a8f5d6ac2a28faabd42a4f8b944cf332ca863a36fa34cc81a91a6bcdb338de13d1952e3d6e3069741804ec7fe23c4185aa2b0aca71978152fa"' }>
                                            <li class="link">
                                                <a href="controllers/OrderController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ProductController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ReviewController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ShopModule-f363e39fbf4749a8f5d6ac2a28faabd42a4f8b944cf332ca863a36fa34cc81a91a6bcdb338de13d1952e3d6e3069741804ec7fe23c4185aa2b0aca71978152fa"' : 'data-target="#xs-injectables-links-module-ShopModule-f363e39fbf4749a8f5d6ac2a28faabd42a4f8b944cf332ca863a36fa34cc81a91a6bcdb338de13d1952e3d6e3069741804ec7fe23c4185aa2b0aca71978152fa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ShopModule-f363e39fbf4749a8f5d6ac2a28faabd42a4f8b944cf332ca863a36fa34cc81a91a6bcdb338de13d1952e3d6e3069741804ec7fe23c4185aa2b0aca71978152fa"' :
                                        'id="xs-injectables-links-module-ShopModule-f363e39fbf4749a8f5d6ac2a28faabd42a4f8b944cf332ca863a36fa34cc81a91a6bcdb338de13d1952e3d6e3069741804ec7fe23c4185aa2b0aca71978152fa"' }>
                                        <li class="link">
                                            <a href="injectables/ItemService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ItemService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProductService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReviewService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UploadModule.html" data-type="entity-link" >UploadModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UploadModule-43e8af938e4fd68f908b78a6c88dbb51d160cf3f6bb82962355b60c2e20c6f0ee494ec6131925b077888aa1b29fdb005fb83a121733e52198f5b9d3a8e2995b2"' : 'data-target="#xs-controllers-links-module-UploadModule-43e8af938e4fd68f908b78a6c88dbb51d160cf3f6bb82962355b60c2e20c6f0ee494ec6131925b077888aa1b29fdb005fb83a121733e52198f5b9d3a8e2995b2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UploadModule-43e8af938e4fd68f908b78a6c88dbb51d160cf3f6bb82962355b60c2e20c6f0ee494ec6131925b077888aa1b29fdb005fb83a121733e52198f5b9d3a8e2995b2"' :
                                            'id="xs-controllers-links-module-UploadModule-43e8af938e4fd68f908b78a6c88dbb51d160cf3f6bb82962355b60c2e20c6f0ee494ec6131925b077888aa1b29fdb005fb83a121733e52198f5b9d3a8e2995b2"' }>
                                            <li class="link">
                                                <a href="controllers/AlbumController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlbumController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/FileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UploadController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UploadModule-43e8af938e4fd68f908b78a6c88dbb51d160cf3f6bb82962355b60c2e20c6f0ee494ec6131925b077888aa1b29fdb005fb83a121733e52198f5b9d3a8e2995b2"' : 'data-target="#xs-injectables-links-module-UploadModule-43e8af938e4fd68f908b78a6c88dbb51d160cf3f6bb82962355b60c2e20c6f0ee494ec6131925b077888aa1b29fdb005fb83a121733e52198f5b9d3a8e2995b2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UploadModule-43e8af938e4fd68f908b78a6c88dbb51d160cf3f6bb82962355b60c2e20c6f0ee494ec6131925b077888aa1b29fdb005fb83a121733e52198f5b9d3a8e2995b2"' :
                                        'id="xs-injectables-links-module-UploadModule-43e8af938e4fd68f908b78a6c88dbb51d160cf3f6bb82962355b60c2e20c6f0ee494ec6131925b077888aa1b29fdb005fb83a121733e52198f5b9d3a8e2995b2"' }>
                                        <li class="link">
                                            <a href="injectables/AlbumService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlbumService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-dcec5a876733d87b0cd4b1d11562c82c6a1aed0097ed2140c10329afe0efd3027c481d48ecec191c23db382a23f817f32a26ecbd66b2de140f5bf1413fb81377"' : 'data-target="#xs-controllers-links-module-UserModule-dcec5a876733d87b0cd4b1d11562c82c6a1aed0097ed2140c10329afe0efd3027c481d48ecec191c23db382a23f817f32a26ecbd66b2de140f5bf1413fb81377"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-dcec5a876733d87b0cd4b1d11562c82c6a1aed0097ed2140c10329afe0efd3027c481d48ecec191c23db382a23f817f32a26ecbd66b2de140f5bf1413fb81377"' :
                                            'id="xs-controllers-links-module-UserModule-dcec5a876733d87b0cd4b1d11562c82c6a1aed0097ed2140c10329afe0efd3027c481d48ecec191c23db382a23f817f32a26ecbd66b2de140f5bf1413fb81377"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/VerifyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerifyController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-dcec5a876733d87b0cd4b1d11562c82c6a1aed0097ed2140c10329afe0efd3027c481d48ecec191c23db382a23f817f32a26ecbd66b2de140f5bf1413fb81377"' : 'data-target="#xs-injectables-links-module-UserModule-dcec5a876733d87b0cd4b1d11562c82c6a1aed0097ed2140c10329afe0efd3027c481d48ecec191c23db382a23f817f32a26ecbd66b2de140f5bf1413fb81377"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-dcec5a876733d87b0cd4b1d11562c82c6a1aed0097ed2140c10329afe0efd3027c481d48ecec191c23db382a23f817f32a26ecbd66b2de140f5bf1413fb81377"' :
                                        'id="xs-injectables-links-module-UserModule-dcec5a876733d87b0cd4b1d11562c82c6a1aed0097ed2140c10329afe0efd3027c481d48ecec191c23db382a23f817f32a26ecbd66b2de140f5bf1413fb81377"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VerifyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerifyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/ActivitiesController.html" data-type="entity-link" >ActivitiesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AddressController.html" data-type="entity-link" >AddressController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AlbumController.html" data-type="entity-link" >AlbumController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ApplicantController.html" data-type="entity-link" >ApplicantController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BlogController.html" data-type="entity-link" >BlogController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CategoryController.html" data-type="entity-link" >CategoryController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CertificateController.html" data-type="entity-link" >CertificateController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ChatsController.html" data-type="entity-link" >ChatsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CommentController.html" data-type="entity-link" >CommentController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CourseController.html" data-type="entity-link" >CourseController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EventController.html" data-type="entity-link" >EventController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FileController.html" data-type="entity-link" >FileController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/GroupController.html" data-type="entity-link" >GroupController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/JobsController.html" data-type="entity-link" >JobsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/LessonController.html" data-type="entity-link" >LessonController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MemberController.html" data-type="entity-link" >MemberController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/OrderController.html" data-type="entity-link" >OrderController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PackagesController.html" data-type="entity-link" >PackagesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PageController.html" data-type="entity-link" >PageController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PolicyController.html" data-type="entity-link" >PolicyController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PostController.html" data-type="entity-link" >PostController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProductController.html" data-type="entity-link" >ProductController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProfileController.html" data-type="entity-link" >ProfileController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReactController.html" data-type="entity-link" >ReactController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RelationController.html" data-type="entity-link" >RelationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReplyController.html" data-type="entity-link" >ReplyController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReportController.html" data-type="entity-link" >ReportController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RespondedController.html" data-type="entity-link" >RespondedController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ResumeController.html" data-type="entity-link" >ResumeController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReviewController.html" data-type="entity-link" >ReviewController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UploadController.html" data-type="entity-link" >UploadController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/VerifyController.html" data-type="entity-link" >VerifyController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/VoteController.html" data-type="entity-link" >VoteController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Activity.html" data-type="entity-link" >Activity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Address.html" data-type="entity-link" >Address</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Album.html" data-type="entity-link" >Album</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Applicant.html" data-type="entity-link" >Applicant</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Blog.html" data-type="entity-link" >Blog</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Category.html" data-type="entity-link" >Category</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Certificate.html" data-type="entity-link" >Certificate</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Chat.html" data-type="entity-link" >Chat</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Comment.html" data-type="entity-link" >Comment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Course.html" data-type="entity-link" >Course</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Event.html" data-type="entity-link" >Event</a>
                                </li>
                                <li class="link">
                                    <a href="entities/File.html" data-type="entity-link" >File</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Group.html" data-type="entity-link" >Group</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Item.html" data-type="entity-link" >Item</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Job.html" data-type="entity-link" >Job</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Lesson.html" data-type="entity-link" >Lesson</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Member.html" data-type="entity-link" >Member</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Message.html" data-type="entity-link" >Message</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Order.html" data-type="entity-link" >Order</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Participant.html" data-type="entity-link" >Participant</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Policy.html" data-type="entity-link" >Policy</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Post.html" data-type="entity-link" >Post</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Product.html" data-type="entity-link" >Product</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Profile.html" data-type="entity-link" >Profile</a>
                                </li>
                                <li class="link">
                                    <a href="entities/React.html" data-type="entity-link" >React</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Relation.html" data-type="entity-link" >Relation</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Reply.html" data-type="entity-link" >Reply</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Report.html" data-type="entity-link" >Report</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Responded.html" data-type="entity-link" >Responded</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Resume.html" data-type="entity-link" >Resume</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Review.html" data-type="entity-link" >Review</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Tag.html" data-type="entity-link" >Tag</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Verify.html" data-type="entity-link" >Verify</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Vote.html" data-type="entity-link" >Vote</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Base.html" data-type="entity-link" >Base</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseGroupType.html" data-type="entity-link" >BaseGroupType</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseQueryInput.html" data-type="entity-link" >BaseQueryInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseService.html" data-type="entity-link" >BaseService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CertificateService.html" data-type="entity-link" >CertificateService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateActivityDto.html" data-type="entity-link" >CreateActivityDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAddressInput.html" data-type="entity-link" >CreateAddressInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAlbumInput.html" data-type="entity-link" >CreateAlbumInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateApplicantDto.html" data-type="entity-link" >CreateApplicantDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBlogInput.html" data-type="entity-link" >CreateBlogInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCategoryInput.html" data-type="entity-link" >CreateCategoryInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCertificateDto.html" data-type="entity-link" >CreateCertificateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateChatDto.html" data-type="entity-link" >CreateChatDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCommentInput.html" data-type="entity-link" >CreateCommentInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCourseDto.html" data-type="entity-link" >CreateCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEventDto.html" data-type="entity-link" >CreateEventDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGroupInput.html" data-type="entity-link" >CreateGroupInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateItemInput.html" data-type="entity-link" >CreateItemInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateJobDto.html" data-type="entity-link" >CreateJobDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLessonDto.html" data-type="entity-link" >CreateLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateMemberInput.html" data-type="entity-link" >CreateMemberInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderInput.html" data-type="entity-link" >CreateOrderInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePackageDto.html" data-type="entity-link" >CreatePackageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePageInput.html" data-type="entity-link" >CreatePageInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePolicyDto.html" data-type="entity-link" >CreatePolicyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePostInput.html" data-type="entity-link" >CreatePostInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductInput.html" data-type="entity-link" >CreateProductInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileInput.html" data-type="entity-link" >CreateProfileInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateReplyInput.html" data-type="entity-link" >CreateReplyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateReportDto.html" data-type="entity-link" >CreateReportDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRespondedDto.html" data-type="entity-link" >CreateRespondedDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResumeDto.html" data-type="entity-link" >CreateResumeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateReviewInput.html" data-type="entity-link" >CreateReviewInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventService.html" data-type="entity-link" >EventService</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileMetaInput.html" data-type="entity-link" >FileMetaInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileUploadInput.html" data-type="entity-link" >FileUploadInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileUploadMultiInput.html" data-type="entity-link" >FileUploadMultiInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/FriendRelationInput.html" data-type="entity-link" >FriendRelationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAddressesOutput.html" data-type="entity-link" >GetAddressesOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAddressOutput.html" data-type="entity-link" >GetAddressOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAlbumOutput.html" data-type="entity-link" >GetAlbumOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAlbumsOutput.html" data-type="entity-link" >GetAlbumsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetApplicantOutput.html" data-type="entity-link" >GetApplicantOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetApplicantsOutput.html" data-type="entity-link" >GetApplicantsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetBlogOutput.html" data-type="entity-link" >GetBlogOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetBlogsOutput.html" data-type="entity-link" >GetBlogsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCertificateOutput.html" data-type="entity-link" >GetCertificateOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCertificatesOutput.html" data-type="entity-link" >GetCertificatesOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCommentOutput.html" data-type="entity-link" >GetCommentOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCommentsOutput.html" data-type="entity-link" >GetCommentsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCourseOutput.html" data-type="entity-link" >GetCourseOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCoursesOutput.html" data-type="entity-link" >GetCoursesOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetEventOutput.html" data-type="entity-link" >GetEventOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetEventsOutput.html" data-type="entity-link" >GetEventsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetFileOutput.html" data-type="entity-link" >GetFileOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetFilesOutput.html" data-type="entity-link" >GetFilesOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupFullOutput.html" data-type="entity-link" >GetGroupFullOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupOutput.html" data-type="entity-link" >GetGroupOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetGroupsOutput.html" data-type="entity-link" >GetGroupsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetJobOutput.html" data-type="entity-link" >GetJobOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetJobsOutput.html" data-type="entity-link" >GetJobsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetLessonOutput.html" data-type="entity-link" >GetLessonOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetLessonsOutput.html" data-type="entity-link" >GetLessonsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetListRespondersOutput.html" data-type="entity-link" >GetListRespondersOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetMemberOutput.html" data-type="entity-link" >GetMemberOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetMembersOutput.html" data-type="entity-link" >GetMembersOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOrderOutput.html" data-type="entity-link" >GetOrderOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOrdersOutput.html" data-type="entity-link" >GetOrdersOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPageOutput.html" data-type="entity-link" >GetPageOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPagesOutput.html" data-type="entity-link" >GetPagesOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPolicysOutput.html" data-type="entity-link" >GetPolicysOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPostOutput.html" data-type="entity-link" >GetPostOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPostsOutput.html" data-type="entity-link" >GetPostsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProductOutput.html" data-type="entity-link" >GetProductOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProductsOutput.html" data-type="entity-link" >GetProductsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileFullyOutput.html" data-type="entity-link" >GetProfileFullyOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileOutput.html" data-type="entity-link" >GetProfileOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfilesOutput.html" data-type="entity-link" >GetProfilesOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetReactOutput.html" data-type="entity-link" >GetReactOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetReactsOutput.html" data-type="entity-link" >GetReactsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRepliesOutput.html" data-type="entity-link" >GetRepliesOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetReplyOutput.html" data-type="entity-link" >GetReplyOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetReportsOutput.html" data-type="entity-link" >GetReportsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRespondedOutput.html" data-type="entity-link" >GetRespondedOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetResumeOutput.html" data-type="entity-link" >GetResumeOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetResumesOutput.html" data-type="entity-link" >GetResumesOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetReviewOutput.html" data-type="entity-link" >GetReviewOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetReviewsOutput.html" data-type="entity-link" >GetReviewsOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserTokenOutput.html" data-type="entity-link" >GetUserTokenOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupFully.html" data-type="entity-link" >GroupFully</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginInput.html" data-type="entity-link" >LoginInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderItems.html" data-type="entity-link" >OrderItems</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderOutput.html" data-type="entity-link" >OrderOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/PolicyService.html" data-type="entity-link" >PolicyService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileFully.html" data-type="entity-link" >ProfileFully</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryAlbumInput.html" data-type="entity-link" >QueryAlbumInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryApplicantInput.html" data-type="entity-link" >QueryApplicantInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryBlogInput.html" data-type="entity-link" >QueryBlogInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryCertificateInput.html" data-type="entity-link" >QueryCertificateInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryCourseInput.html" data-type="entity-link" >QueryCourseInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryEventInput.html" data-type="entity-link" >QueryEventInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryFileInput.html" data-type="entity-link" >QueryFileInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryGroupInput.html" data-type="entity-link" >QueryGroupInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryJobInput.html" data-type="entity-link" >QueryJobInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryLessonInput.html" data-type="entity-link" >QueryLessonInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryMemberInput.html" data-type="entity-link" >QueryMemberInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryPageInput.html" data-type="entity-link" >QueryPageInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryPolicyInput.html" data-type="entity-link" >QueryPolicyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryPostInput.html" data-type="entity-link" >QueryPostInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryProfileInput.html" data-type="entity-link" >QueryProfileInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryReactInput.html" data-type="entity-link" >QueryReactInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryReportInput.html" data-type="entity-link" >QueryReportInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryRespondedInput.html" data-type="entity-link" >QueryRespondedInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryResumeInput.html" data-type="entity-link" >QueryResumeInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterInput.html" data-type="entity-link" >RegisterInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportService.html" data-type="entity-link" >ReportService</a>
                            </li>
                            <li class="link">
                                <a href="classes/RespondedService.html" data-type="entity-link" >RespondedService</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendEmailInput.html" data-type="entity-link" >SendEmailInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Setting.html" data-type="entity-link" >Setting</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateActivityDto.html" data-type="entity-link" >UpdateActivityDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAddressInput.html" data-type="entity-link" >UpdateAddressInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAlbumInput.html" data-type="entity-link" >UpdateAlbumInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateApplicantDto.html" data-type="entity-link" >UpdateApplicantDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBlogInput.html" data-type="entity-link" >UpdateBlogInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCategoryInput.html" data-type="entity-link" >UpdateCategoryInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCertificateDto.html" data-type="entity-link" >UpdateCertificateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateChatDto.html" data-type="entity-link" >UpdateChatDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCommentInput.html" data-type="entity-link" >UpdateCommentInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCourseDto.html" data-type="entity-link" >UpdateCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEventDto.html" data-type="entity-link" >UpdateEventDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateFile1675581548131.html" data-type="entity-link" >UpdateFile1675581548131</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateFileInput.html" data-type="entity-link" >UpdateFileInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateGroupInput.html" data-type="entity-link" >UpdateGroupInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateIndex1674142108462.html" data-type="entity-link" >UpdateIndex1674142108462</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateJobDto.html" data-type="entity-link" >UpdateJobDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateLessonDto.html" data-type="entity-link" >UpdateLessonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMember1673092837337.html" data-type="entity-link" >UpdateMember1673092837337</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMemberInput.html" data-type="entity-link" >UpdateMemberInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrder1672669949170.html" data-type="entity-link" >UpdateOrder1672669949170</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrderInput.html" data-type="entity-link" >UpdateOrderInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePackageDto.html" data-type="entity-link" >UpdatePackageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePageInput.html" data-type="entity-link" >UpdatePageInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePolicyDto.html" data-type="entity-link" >UpdatePolicyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePost1673112208936.html" data-type="entity-link" >UpdatePost1673112208936</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePost1673275088811.html" data-type="entity-link" >UpdatePost1673275088811</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePost1675778095160.html" data-type="entity-link" >UpdatePost1675778095160</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePostInput.html" data-type="entity-link" >UpdatePostInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProduct1672652255472.html" data-type="entity-link" >UpdateProduct1672652255472</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductInput.html" data-type="entity-link" >UpdateProductInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfile1672557252018.html" data-type="entity-link" >UpdateProfile1672557252018</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfile1672584073261.html" data-type="entity-link" >UpdateProfile1672584073261</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfile1672841432021.html" data-type="entity-link" >UpdateProfile1672841432021</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileInput.html" data-type="entity-link" >UpdateProfileInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRelationInput.html" data-type="entity-link" >UpdateRelationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateReplyInput.html" data-type="entity-link" >UpdateReplyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRespondedDto.html" data-type="entity-link" >UpdateRespondedDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResumeDto.html" data-type="entity-link" >UpdateResumeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpsertReactInput.html" data-type="entity-link" >UpsertReactInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpsertRelationInput.html" data-type="entity-link" >UpsertRelationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpsertVoteInput.html" data-type="entity-link" >UpsertVoteInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserToken.html" data-type="entity-link" >UserToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyInput.html" data-type="entity-link" >VerifyInput</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ActivitiesService.html" data-type="entity-link" >ActivitiesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AddressService.html" data-type="entity-link" >AddressService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AlbumService.html" data-type="entity-link" >AlbumService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApplicantService.html" data-type="entity-link" >ApplicantService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BlogService.html" data-type="entity-link" >BlogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CategoryService.html" data-type="entity-link" >CategoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatsService.html" data-type="entity-link" >ChatsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommentService.html" data-type="entity-link" >CommentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CourseService.html" data-type="entity-link" >CourseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link" >FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GroupService.html" data-type="entity-link" >GroupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ItemService.html" data-type="entity-link" >ItemService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JobsService.html" data-type="entity-link" >JobsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LessonService.html" data-type="entity-link" >LessonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggerMiddleware.html" data-type="entity-link" >LoggerMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MemberService.html" data-type="entity-link" >MemberService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderService.html" data-type="entity-link" >OrderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PackagesService.html" data-type="entity-link" >PackagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PageService.html" data-type="entity-link" >PageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostService.html" data-type="entity-link" >PostService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductService.html" data-type="entity-link" >ProductService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileService.html" data-type="entity-link" >ProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReactService.html" data-type="entity-link" >ReactService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RelationService.html" data-type="entity-link" >RelationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReplyService.html" data-type="entity-link" >ReplyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResumeService.html" data-type="entity-link" >ResumeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReviewService.html" data-type="entity-link" >ReviewService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TagService.html" data-type="entity-link" >TagService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VerifyService.html" data-type="entity-link" >VerifyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VoteService.html" data-type="entity-link" >VoteService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/UploadFileInterceptorProps.html" data-type="entity-link" >UploadFileInterceptorProps</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
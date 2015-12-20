"use strict";

require("./main.css");
require("angular");
require("angular-ui-router");

const TemplateNgIncluding = () => ({
  template: `<div ng-include="vm.tpl"/>`
})

const SubjectAndTplScopeProviding = () => ({
  controllerAs: "vm",
  controller: ['subject', '$state', function(subject, state) {
    let vm = this;
    vm.subject = subject;
    vm.tpl = state.current.name + '.' + subject.type;
  }]
})

const SubjectProvidingTemplateIncluding = () =>
  Object.assign(SubjectAndTplScopeProviding(), TemplateNgIncluding());

const SubjectScopeHaving = () => ({
  scope: {
    subject: '='
  },
  controllerAs: "vm",
  bindToController: true,
  controller: angular.noop
});

const SubjectFormSubmitting = () => ({
  controller: function() {
    let vm = this;
    vm.submit = () => {
      console.log(vm.subject);
    }
  }
})

const subjects = {
  1: {id: 1, type: 'thing', message: 'hi there'},
  2: {id: 2, type: 'thong', message: 'bye there'}
};

const SubjectResolving = () => ({
  subject: ['$q', '$stateParams', ($q, $stateParams) => {
    let deferred = $q.defer();

    setTimeout(() => {
      deferred.resolve(subjects[$stateParams.id]);
    }, 1000);

    return deferred.promise;
  }]
});

angular.module("app", ["ui.router"])
  .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {

    $urlRouterProvider.otherwise("/step/1/step1");

    $stateProvider
    .state("step", Object.assign(SubjectAndTplScopeProviding(), {
      url: "/step/:id",
      abstract: true,
      template: "<div our-heading subject='vm.subject'></div><div ui-view></div>",
      resolve: SubjectResolving()
    }))
    .state("step.one", Object.assign(SubjectProvidingTemplateIncluding(), {
      url: "/step1"
    }))
    .state("step.two", Object.assign(SubjectProvidingTemplateIncluding(), {
      url: "/step2"
    }))

  }])
  .directive('ourPage1', () => Object.assign(SubjectScopeHaving(), {
    template: "<input type='text' ng-model='vm.subject.message'>"
  }))
  .directive('ourPage2', () => Object.assign(SubjectScopeHaving(), SubjectFormSubmitting(), {
    template: `
<form ng-submit="vm.submit()">
  <h2>{{vm.subject.message}}</h2>
  <input type="Submit" value="Submit" name="submit">
</form>
`
  }))
  .directive('ourHeading', () => Object.assign(SubjectScopeHaving(), {
    template: `
<h1 class="header__id">id:{{vm.subject.id}}</h1>
<a ui-sref-active='header__link--active' ui-sref='.one'>to step1</a>
--
<a ui-sref-active='header__link--active' ui-sref='.two'>to step2</a>
`
  }))

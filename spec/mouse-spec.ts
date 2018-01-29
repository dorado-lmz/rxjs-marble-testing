declare var describe, it, expect, hot, cold, expectObservable, expectSubscriptions, beforeEach;
import {getAvaliableStream} from '../src/mouse';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/share';

describe('新建视频片段的三个事件流（Click1$, Click2$, initMove$）相互约束关系正确！', () => {
    it.asDiagram('init')('单击时间轴新建片段，三个事件流生效', () => {
        const click1$ =    hot('^a-----b-----c----|');
        const click2$ =    hot('^--a-----|');
        const mouseMove$ = hot('^-aaaa---|');
        const mouseDown$ = null;
        const mouseUp$ = null;

        const {Click1$,  Click2$, initMove$} = getAvaliableStream(click1$, click2$, mouseDown$, mouseUp$, mouseMove$);
        expectObservable(Click1$).  toBe('-a-----b----------|');
        expectObservable(Click2$).  toBe('---a--------------|');
        expectObservable(initMove$).toBe('--a---------------|')
    });
    it.asDiagram('click2->click1')('Click2$必须在Click1$ emit事件后生效！', () => {
        const click1$ =    hot('^-a-----b-----c----|');
        const click2$ =    hot('^a--b-----|');
        const mouseMove$ = hot('^--aaaa---|');
        const mouseDown$ = null;
        const mouseUp$ = null;

        const {Click1$,  Click2$, initMove$} = getAvaliableStream(click1$, click2$, mouseDown$, mouseUp$, mouseMove$);
        expectObservable(Click1$).  toBe('--a-----b----------|');
        expectObservable(Click2$).  toBe('----b--------------|');
        expectObservable(initMove$).toBe('---a---------------|')
    });
    it.asDiagram('initMove->click1')('initMove$必须在Click1$ emit事件后生效！', () => {
        const click1$ =    hot('^--a-----b-----c----|');
        const click2$ =    hot('^a---b-----|');
        const mouseMove$ = hot('^aa-aaaa---|');
        const mouseDown$ = null;
        const mouseUp$ = null;

        const {Click1$,  Click2$, initMove$} = getAvaliableStream(click1$, click2$, mouseDown$, mouseUp$, mouseMove$);
        expectObservable(Click1$).  toBe('---a-----b----------|');
        expectObservable(Click2$).  toBe('-----b--------------|');
        expectObservable(initMove$).toBe('----a---------------|')
    });
    it.asDiagram('initMove-x-click2')('initMove$被Click1$ emit事件后失效！', () => {
        const click1$ =    hot('^--a-----b-----c----|');
        const click2$ =    hot('^a---b----d|');
        const mouseMove$ = hot('^aa-aaaa-cc|');
        const mouseDown$ = null;
        const mouseUp$ = null;

        const {Click1$,  Click2$, initMove$} = getAvaliableStream(click1$, click2$, mouseDown$, mouseUp$, mouseMove$);
        expectObservable(Click1$).  toBe('---a-----b-----c----|');
        expectObservable(Click2$).  toBe('-----b----d---------|');
        expectObservable(initMove$).toBe('----a----c----------|')
    });
});


describe('The getAvaliableStream', () => {
    it('单击时间轴新建片段之后，双击两次', () => {
        const click1$ =    hot('^a-----b-----c----|');
        const click2$ =    hot('^------a-|');
        const mouseMove$ = hot('^-aaaa---|');
        const mouseDown$ = null;
        const mouseUp$ = null;

        const {Click1$,  Click2$, initMove$} = getAvaliableStream(click1$, click2$, mouseDown$, mouseUp$, mouseMove$);
        expectObservable(Click1$).  toBe('-a-----------c----|');
        expectObservable(Click2$).  toBe('-------a----------|');
        expectObservable(initMove$).toBe('--aaaa------------|')
    });
});

describe('The getAvaliableStream', () => {
    it('单击时间轴新建片段之后，双击两次', () => {
        const click1$ =    hot('^a-----b-----c----|');
        const click2$ =    hot('^------a-|');
        const mouseMove$ = hot('^-aaaa---|');
        const mouseDown$ = null;
        const mouseUp$ = null;

        const {Click1$,  Click2$, initMove$} = getAvaliableStream(click1$, click2$, mouseDown$, mouseUp$, mouseMove$);
        expectObservable(Click1$).   toBe('-a-----------c----|');
        expectObservable(Click2$).   toBe('-------a----------|');
        expectObservable(initMove$). toBe('--aaaa------------|');
    });
});


describe('锁正确', () => {
    it('进入新建视频片段之后，就无法进入拖动！', () => {
        const click1$ =    hot('^a-----b-----c----|');
        const click2$ =    hot('^------a-|');
        const mouseMove$ = hot('^-aaaa---|');
        const mouseDown$ = hot('^aaaaaa-----------|');
        const mouseUp$ = null;

        const {Click1$,  Click2$, initMove$,  MouseDown$} = getAvaliableStream(click1$, click2$, mouseDown$, mouseUp$, mouseMove$);
        expectObservable(Click1$).   toBe('-a-----------c----|');
        expectObservable(Click2$).   toBe('-------a----------|');
        expectObservable(initMove$). toBe('--aaaa------------|');
        expectObservable(MouseDown$).toBe('------------------|')
    });
    it('进入拖动之后，就无法进入新建视频片段！', () => {
        const click1$ =    hot('^a-----b-----c----|');
        const click2$ =    hot('^------a-|');
        const mouseMove$ = hot('^-aaaa---|');
        const mouseDown$ = hot('^aaaaaaa----------|');
        const mouseUp$ = null;

        const {Click1$,  Click2$, initMove$,  MouseDown$} = getAvaliableStream(click1$, click2$, mouseDown$, mouseUp$, mouseMove$);
        expectObservable(Click1$).   toBe('-a----------------|');
        expectObservable(Click2$).   toBe('-------a----------|');
        expectObservable(initMove$). toBe('--aaaa------------|');
        expectObservable(MouseDown$).toBe('-------a----------|')
    });
});

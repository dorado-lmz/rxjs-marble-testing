export function getAvaliableStream(click1$, click2$, mouseDown$, mouseUp$, mouseMove$) {
    let flag, initing, draging;
    const Click1$ = click1$.filter((event) => {
        return !flag && !draging;
    }).do(() => {
        flag = true;
        initing = true;
    }).share();


    const Click2$ = Click1$.concatMap(() => click2$.take(1)).do(() => {
        flag = false;
        initing = false;
    });

    const initMove$ = Click1$.concatMap(() => mouseMove$.takeUntil(click2$));


    const MouseDown$ = mouseDown$ && mouseDown$.filter((event) => {
        return !flag && !initing;
    }).do(() => {
        flag = true;
        draging = true;
    }).share();

    const MouseUp$ = mouseUp$ && MouseDown$.concatMap(() => mouseUp$.take(1)).do(() => {
        flag = false;
        draging = false;
    });

    const dragMove$ = MouseDown$ && MouseDown$.concatMap(() => mouseMove$.takeUntil(mouseUp$));



    return {
        Click1$,
        Click2$,
        initMove$,
        MouseDown$,
        MouseUp$,
        dragMove$
    }
}
let _loading: boolean = $state(false);

export function loadingState() {
    return _loading;
}

export function setLoadingState(value: boolean) {
    _loading = value;
}
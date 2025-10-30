/* js/skeletons.js */

export function createListSkeleton(count = 3) {
    let skeletonHTML = '';
    for (let i = 0; i < count; i++) {
        skeletonHTML += '<div class="skeleton skeleton-list-item"></div>';
    }
    return skeletonHTML;
}

export function createCardSkeleton(count = 3) {
    let skeletonHTML = '';
    for (let i = 0; i < count; i++) {
        skeletonHTML += '<div class="skeleton skeleton-card"></div>';
    }
    return skeletonHTML;
}

export function createTextSkeleton(lines = 3) {
    let skeletonHTML = '';
    for (let i = 0; i < lines; i++) {
        skeletonHTML += '<div class="skeleton skeleton-text"></div>';
    }
    return skeletonHTML;
}

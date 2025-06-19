import type { DOMElement } from '@/types/types'
import { type Ref } from 'vue'

export type UseCollisionDetectionReturn = ReturnType<typeof useCollisionDetection>

export function useCollisionDetection(refEl: Ref<DOMElement>) {
    function collidesWith(secondEl: DOMElement): boolean {
        if (!refEl.value || !secondEl) {
            return false;
        }

        const refRect = refEl.value.getBoundingClientRect();
        const secondRect = secondEl.getBoundingClientRect();

        return (
            secondRect.left < refRect.left + refRect.width &&
            secondRect.left + secondRect.width > refRect.left &&
            secondRect.top < refRect.top + refRect.height &&
            secondRect.top + secondRect.height > refRect.top
        );
    }

    function getCenter(el: DOMElement): { x: number; y: number } | null {
        if (!el) {
            return null;
        }

        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function closestElement(elements: DOMElement[]): DOMElement | null {
        if (!refEl.value || elements.length === 0) {
            return null;
        }

        let closest: DOMElement | null = null;
        let closestDistance = Infinity;

        for (const el of elements) {
            if (!el) 
                continue;

            const refRectCenter = getCenter(refEl.value);
            const rect2Center = getCenter(el);

            if (!refRectCenter || !rect2Center) {
                continue;
            }
            const distance = Math.sqrt(
                Math.pow(refRectCenter.x - rect2Center.x, 2) +
                Math.pow(refRectCenter.y - rect2Center.y, 2)
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = el;
            }
        }

        return closest;
    }

    return {
        collidesWith,
        closestElement
    };
}

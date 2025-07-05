import type { DOMElement } from '../types/types';
import { type DeepReadonly, type Ref } from 'vue';

export type UseCollisionDetectionReturn = ReturnType<typeof useCollisionDetection>;

export function useCollisionDetection(refEl: DeepReadonly<Ref<DOMElement>>) {
    function collidesWith(secondEl: DOMElement): boolean {
        if (!refEl.value || !secondEl) {
            return false;
        }

        const refRect = refEl.value.getBoundingClientRect();
        const secondRect = secondEl.getBoundingClientRect();

        const threshhold = 10;

        return (
            secondRect.left + threshhold < refRect.left + refRect.width &&
            secondRect.left + secondRect.width - threshhold > refRect.left &&
            secondRect.top + threshhold < refRect.top + refRect.height &&
            secondRect.top + secondRect.height - threshhold > refRect.top
        );
    }

    function getCenter(el: DeepReadonly<DOMElement>): { x: number; y: number } | null {
        if (!el) {
            return null;
        }

        const rect = el.getBoundingClientRect();

        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
    }

    function closestElement(elements: DeepReadonly<DOMElement[]>): number | null {
        if (!refEl.value || elements.length === 0) {
            return null;
        }

        let closest: number = 0;
        let closestDistance = Infinity;

        elements.forEach((el, index) => {
            if (!el) return;

            const refRectCenter = getCenter(refEl.value);
            const rect2Center = getCenter(el);

            if (!refRectCenter || !rect2Center) {
                return;
            }
            const distance = Math.sqrt(
                Math.pow(refRectCenter.x - rect2Center.x, 2) +
                    Math.pow(refRectCenter.y - rect2Center.y, 2),
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = index;
            }
        });

        return closest;
    }

    return {
        collidesWith,
        closestElement,
    };
}

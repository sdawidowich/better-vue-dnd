import type { DOMElement } from '@/types/types'
import { type Ref } from 'vue'

export type UseCollisionDetectionReturn = ReturnType<typeof useCollisionDetection>

export function useCollisionDetection(refEl: Ref<DOMElement>) {
    function collidesWith(secondEl: DOMElement): boolean {
        if (!refEl.value || !secondEl) {
            return false;
        }

        const rect1 = refEl.value.getBoundingClientRect();
        const rect2 = secondEl.getBoundingClientRect();

        return (
            rect2.left < rect1.left + rect1.width &&
            rect2.left + rect2.width > rect1.left &&
            rect2.top < rect1.top + rect1.height &&
            rect2.top + rect2.height > rect1.top
        )
    }

    function closestElement(elements: DOMElement[]): DOMElement | null {
        if (!refEl.value || elements.length === 0) {
            return null;
        }

        let closest: DOMElement | null = null;
        let closestDistance = Infinity;

        const rect1 = refEl.value.getBoundingClientRect();

        for (const el of elements) {
            if (!el) continue;

            const rect2 = el.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(rect1.left - rect2.left, 2) +
                Math.pow(rect1.top - rect2.top, 2)
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

import type { DOMElementBounds } from '../types/types';

export type UseCollisionDetectionReturn = ReturnType<typeof useCollisionDetection>;

export function useCollisionDetection(refRect: DOMElementBounds) {
    function collidesWith(targetRect: DOMElementBounds): boolean {
        if (!refRect || !targetRect) {
            return false
        }

        const threshhold = 10

        return (
            targetRect.left + threshhold < refRect.left + refRect.width &&
            targetRect.left + targetRect.width - threshhold > refRect.left &&
            targetRect.top + threshhold < refRect.top + refRect.height &&
            targetRect.top + targetRect.height - threshhold > refRect.top
        )
    }

    function getCenter(bounds: DOMElementBounds): { x: number; y: number } {
        return {
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2,
        }
    }

    function closestElement(boundingRects: DOMElementBounds[]): number | null {
        if (!refRect || boundingRects.length === 0) {
            return null
        }

        let closest: number = 0
        let closestDistance = Infinity

        boundingRects.forEach((rect, index) => {
            if (!rect) return

            const refRectCenter = getCenter(refRect)
            const rect2Center = getCenter(rect)

            if (!refRectCenter || !rect2Center) {
                return
            }
            const distance = Math.sqrt(
                Math.pow(refRectCenter.x - rect2Center.x, 2) + Math.pow(refRectCenter.y - rect2Center.y, 2)
            )

            if (distance < closestDistance) {
                closestDistance = distance
                closest = index
            }
        })

        return closest
    }

    return {
        collidesWith,
        closestElement,
    }
}

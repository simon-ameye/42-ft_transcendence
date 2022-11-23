import { useEffect, useRef } from "react";

export default function useKey(key:string, callback:Function) {
	const callbackRef = useRef(callback)	

	useEffect(() => {
		callbackRef.current = callback;
	})
	useEffect(() => {
		function handle(e:KeyboardEvent) {
			if (e.code === key)
				callbackRef.current(e);
		}
		window.addEventListener("keypress", handle)
		return () => window.removeEventListener("keypress", handle)
	}, [key])
}
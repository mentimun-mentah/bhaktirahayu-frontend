const copy = (v) => {
	if (v === null) return null;
	switch(v.constructor) {
		case Array:
			var l = v.length; i = 0, a = Array(l);
			for (i; i<l; i++) {
				a[i] = v[i];
			}
			return a;
		case Number:
			return v * 1;
		case String:
			return String(v);
		case Function:
			return eval(v);
		case Boolean:
			return !!v;
	}
}

export const deepCopy = (obj) => {
	let k = Object.keys(obj), io = {}, i = k.length;
	for (i; i--;) {
		if (obj[k[i]] && obj[k[i]].constructor === Object) {
			io[k[i]] = deepCopy(obj[k[i]]);
			continue;
		}
		io[k[i]] = copy(obj[k[i]]);
	}
	return io;
}

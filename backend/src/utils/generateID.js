export function uuidv4() {
    const hex = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return (
      hex(4) + hex(4) + "-" + hex(4) + "-" + hex(4) + "-" + hex(4) + "-" + hex(4) + hex(4) + hex(4)
    );
  }
  
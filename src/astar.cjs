var methods = {
    getWeight: function (node, end) {
        return (
            node.weight +
            Math.sqrt(Math.pow(node.x - end.x, 2) + Math.pow(node.y - end.y, 2))
        );
    },
};

exports.data = methods;
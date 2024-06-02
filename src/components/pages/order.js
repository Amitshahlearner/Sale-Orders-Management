import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Box, Button, Flex, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, Input, useDisclosure, Select
} from '@chakra-ui/react';

const products = [
  { id: 1, name: 'Product A', skus: [{ id: 101, name: 'SKU A1', price: 10 }, { id: 102, name: 'SKU A2', price: 20 }] },
  { id: 2, name: 'Product B', skus: [{ id: 103, name: 'SKU B1', price: 30 }, { id: 104, name: 'SKU B2', price: 40 }] },
];

const OrdersPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { register, handleSubmit, setValue, reset, control } = useForm();

  const [activeOrders, setActiveOrders] = useState([
    { id: 1, customerName: 'Customer A', items: [{ skuId: 101, price: 10, quantity: 1 }], lastModified: '2024-05-24 11:37 PM' },
    { id: 2, customerName: 'Customer B', items: [{ skuId: 103, price: 30, quantity: 2 }], lastModified: '2024-05-24 11:39 PM' },
  ]);

  const [completedOrders, setCompletedOrders] = useState([
    { id: 3, customerName: 'Customer C', items: [{ skuId: 102, price: 20, quantity: 3 }], lastModified: '2024-05-24 11:45 PM' },
  ]);

  const [isActiveTab, setIsActiveTab] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleTabSwitch = (isActive) => {
    setIsActiveTab(isActive);
  };

  const handleAddSaleOrder = (data) => {
    const newOrder = {
      id: activeOrders.length + completedOrders.length + 1,
      customerName: '', 
      items: data.items,
      lastModified: new Date().toLocaleString(),
    };
    setActiveOrders([...activeOrders, newOrder]);
    onClose();
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsEditMode(true);
    setValue('customerName', order.customerName);
    setValue('price', order.items[0].price); 
    onEditOpen();
  };

  const handleSaveOrder = (data) => {
    setActiveOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, customerName: data.customerName, items: [{ ...order.items[0], price: data.price }], lastModified: new Date().toLocaleString() }
          : order
      )
    );
    onEditClose();
  };

  const handleProductChange = (e) => {
    const product = products.find(p => p.id === parseInt(e.target.value));
    setSelectedProduct(product);
    reset({ items: product ? product.skus.map(sku => ({ skuId: sku.id, name: sku.name, price: sku.price, quantity: 1 })) : [] });
  };

  return (
    <Box p={20}>
      <Flex justifyContent="space-between" mb={4}>
        <Button
          onClick={() => handleTabSwitch(true)}
          colorScheme={isActiveTab ? 'teal' : 'gray'}
        >
          Active Sale Orders
        </Button>
        <Button
          onClick={() => handleTabSwitch(false)}
          colorScheme={!isActiveTab ? 'teal' : 'gray'}
        >
          Completed Sale Orders
        </Button>
        <Button
          onClick={() => { setIsEditMode(false); reset(); onOpen(); }}
          colorScheme="teal"
        >
          + Sale Order
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Customer Name</Th>
            <Th>Price</Th>
            <Th>Last Modified</Th>
            <Th>Edit/View</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(isActiveTab ? activeOrders : completedOrders).map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.customerName}</Td>
              <Td>{order.items[0].price}</Td>
              <Td>{order.lastModified}</Td>
              <Td>
                <Button
                  size="sm"
                  onClick={() => isActiveTab && handleEditOrder(order)}
                  isDisabled={!isActiveTab}
                >
                  ...
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Sale Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(handleAddSaleOrder)}>
              <Select placeholder="Select Product" onChange={handleProductChange} mb={4}>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </Select>
              {selectedProduct && selectedProduct.skus.map((sku, index) => (
                <Box key={sku.id} mb={4} borderWidth="1px" borderRadius="lg" p={4}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box fontWeight="bold">{sku.name}</Box>
                    <Box fontWeight="bold">Price: ${sku.price}</Box>
                  </Flex>
                  <Input
                    placeholder="Enter selling price"
                    {...register(`items.${index}.price`, { required: true })}
                    defaultValue={sku.price}
                    mb={2}
                  />
                  <Input
                    placeholder="Enter quantity"
                    {...register(`items.${index}.quantity`, { required: true })}
                    defaultValue={1}
                  />
                </Box>
              ))}
              <Button type="submit" colorScheme="blue" mr={3}>
                Create
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Customer Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(handleSaveOrder)}>
              <Input
                placeholder="Customer Name"
                mb={4}
                {...register('customerName', { required: true })}
              />
              <Input
                placeholder="Price"
                mb={4}
                {...register('price', { required: true })}
              />
              <Button type="submit" colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button variant="ghost" onClick={onEditClose}>Cancel</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrdersPage;

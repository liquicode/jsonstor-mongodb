# @liquicode/jsonstor-mongodb

> Documents are stored on a MongoDB server.

# Test Results

```
> @liquicode/jsonstor-mongodb@0.0.21 test
> mocha -u bdd test/*.js --timeout 0 --slow 10 --colors



  jsonstor-mongodb Tests
    A) CRUD Tests
      ✔ should insert 100 documents, one at a time (1104ms)
      ✔ should delete 100 documents, all at once (24ms)
      ✔ should insert 100 documents, all at once (28ms)
      ✔ should read 100 documents, one at a time (866ms)
      ✔ should replace 100 documents, one at a time (1900ms)
      ✔ should read 100 documents, all at once (9ms)
      ✔ should read 5 documents, all at once and sorted (9ms)
      ✔ should update 100 documents, one at a time (1027ms)
      ✔ should update 100 documents, all at once (13ms)
      ✔ should delete 100 documents, one at a time (943ms)
    B) Rainbow Tests
      Nested Fields (explicit)
        ✔ should not perform matching on nested fields using implicit $eq (8ms)
        ✔ should not perform matching on nested fields using explicit $eq (7ms)
      Nested Fields (dot notation)
        ✔ should perform matching on nested fields using implicit $eq and dot notation (9ms)
        ✔ should perform matching on nested fields using explicit $eq and dot notation (8ms)
      Operator $eq (===)
        ✔ should perform strict equality (===) on 'bns' (48ms)
        ✔ should perform strict equality (===) on 'o' (16ms)
        ✔ should perform strict equality (===) on 'a' (16ms)
        ✔ should not perform loose equality (==) on 'bns' (52ms)
        ✔ should not perform loose equality (==) on 'o' (17ms)
        ✔ should not perform loose equality (==) on 'a' (17ms)
        ✔ should equate null with an undefined field (8ms)
      Operator $ne (!==)
        ✔ should perform strict inequality (!==) on 'bns' (48ms)
        ✔ should perform strict inequality (!==) on 'o' (8ms)
        ✔ should perform strict inequality (!==) on 'a' (7ms)
        ✔ should not perform loose inequality (!=) on 'bns' (26ms)
        ✔ should not perform loose inequality (!=) on 'o' (8ms)
        ✔ should not perform loose inequality (!=) on 'a' (8ms)
      Operator $gte (>=)
        ✔ should perform strict comparison (>=) on 'bns' (51ms)
        ✔ should not perform loose comparison (>=) on 'bns' (25ms)
        ✔ should equate null with an undefined field (10ms)
      Operator $gt (>)
        ✔ should perform strict comparison (>=) on 'bns' (30ms)
        ✔ should not perform loose comparison (>=) on 'bns' (26ms)
      Operator $lte (<=)
        ✔ should perform strict comparison (<=) on 'bns' (24ms)
        ✔ should not perform loose comparison (<=) on 'bns' (24ms)
        ✔ should equate null with an undefined field (8ms)
      Operator $lt (<)
        ✔ should perform strict comparison (<) on 'bns' (26ms)
        ✔ should not perform loose comparison (<) on 'bns' (23ms)
    C) UserInfo Permissions Tests
      Alice, Bob, and Eve scenario
        ✔ Should add documents and set permissions (138ms)
        ✔ Alice should read all documents and write all documents (271ms)
        ✔ Bob should read some documents and write some documents (242ms)
        ✔ Eve should read some documents and write some documents (195ms)
        ✔ Public objects should be readable by everyone (162ms)
        ✔ Public objects should only be writable by the owner (196ms)
        ✔ Should not allow readers to update documents (200ms)
    D) Engine Contract Tests
      ✔ should refuse a criteria naming an unknown operator (44ms)
      ✔ should refuse a criteria which is not an object (14ms)
      ✔ should refuse an update naming an unknown operator (8ms)
      ✔ should refuse an update which cannot be applied (9ms)
      ✔ should not alias a FindOne result to the stored document (37ms)
      ✔ should not alias a FindMany result to the stored documents (39ms)
      ✔ should sort a missing field and a null below every value (31ms)
      ✔ should reverse that order when sorting descending (9ms)
      ✔ should limit the result to MaxCount after sorting (8ms)
    M) MongoDB Tutorial
      Query Documents (https://www.mongodb.com/docs/manual/tutorial/query-documents/)
        Select All Documents in a Collection
          ✔ Match All Documents with an Empty Object {} (7ms)
        Specify Equality Condition
          ✔ Match Fields with Implicit Equality (8ms)
        Specify Conditions Using Query Operators
          ✔ Match Fields with an Array of Possible Values (7ms)
        Specify AND Conditions
          ✔ Match Fields with an Array of Possible Values (8ms)
        Specify OR Conditions
          ✔ Match Fields against an Array of Possible Values (7ms)
        Specify AND as well as OR Conditions
          ✔ Match Fields Using AND and OR (8ms)
      Query on Embedded/Nested Documents (https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/)
        Query on Embedded/Nested Documents
          ✔ Specify Equality Match on a Nested Field (8ms)
          ✔ Specify Match using Query Operator (7ms)
          ✔ Specify AND Condition (8ms)
        Match an Embedded/Nested Document
          ✔ Specify Equality Match on an Embedded Document (15ms)
      Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
        Match an Array
          ✔ Match an Array Exactly (7ms)
          ✔ Match Array Elements (8ms)
        Query an Array for an Element
          ✔ Match a Single Array Element (7ms)
          ✔ Match Array Elements by Comparison (9ms)
        Specify Multiple Conditions for Array Elements
          ✔ Query an Array with Compound Filter Conditions on the Array Elements (7ms)
          ✔ Query for an Array Element that Meets Multiple Criteria (8ms)
          ✔ Query for an Element by the Array Index Position (7ms)
          ✔ Query an Array by Array Length (8ms)
      Query an Array of Embedded Documents (https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/)
        Query for a Document Nested in an Array
          ✔ Match a Document Exactly (8ms)
        Specify a Query Condition on a Field in an Array of Documents
          ✔ Specify a Query Condition on a Field Embedded in an Array of Documents (8ms)
          ✔ Use the Array Index to Query for a Field in the Embedded Document (10ms)
        Specify Multiple Conditions for Array of Documents
          ✔ A Single Nested Document Meets Multiple Query Conditions on Nested Fields (17ms)
          ✔ Combination of Elements Satisfies the Criteria (17ms)
      Query for Null or Missing Fields (https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)
        Equality Filter
          ✔ Match Fields that are Null or Missing (9ms)
        Type Check
          ✔ Match Fields that Exist And are Null (8ms)
        Existence Check
          ✔ Match Fields that are Missing (9ms)
    N) MongoDB Reference
      Comparison Query Operators
        Comparison Operator: $eq (https://www.mongodb.com/docs/manual/reference/operator/query/eq/)
          Equals an Array Value
            ✔ Match an Array Element (9ms)
            ✔ Match an Array Element Using Implicit $eq (7ms)
          Regex Match Behaviour
            ✔ $eq match on a string (16ms)
            ✔ $eq match on a regular expression (9ms)
            ✔ Use the $in Operator with a Regular Expression (16ms)
        Comparison Operator: $gt (https://www.mongodb.com/docs/manual/reference/operator/query/gt/)
          ✔ Match Document Fields (8ms)
        Comparison Operator: $gte (https://www.mongodb.com/docs/manual/reference/operator/query/gte/)
          ✔ Match Document Fields (8ms)
        Comparison Operator: $in (https://www.mongodb.com/docs/manual/reference/operator/query/in/)
          ✔ Use the $in Operator to Match Values (8ms)
          ✔ Use the $in Operator to Match Values in an Array (9ms)
          ✔ Use the $in Operator with a Regular Expression (7ms)
        Comparison Operator: $lt (https://www.mongodb.com/docs/manual/reference/operator/query/lt/)
          ✔ Match Document Fields (7ms)
        Comparison Operator: $lte (https://www.mongodb.com/docs/manual/reference/operator/query/lte/)
          ✔ Match Document Fields (10ms)
        Comparison Operator: $ne (https://www.mongodb.com/docs/manual/reference/operator/query/ne/)
          ✔ Match Document Fields (7ms)
        Comparison Operator: $nin (https://www.mongodb.com/docs/manual/reference/operator/query/nin/)
          ✔ Select on Unmatching Documents (8ms)
          ✔ Select on Elements Not in an Array (8ms)
      Logical Query Operators
        Logical Operator: $and (https://www.mongodb.com/docs/manual/reference/operator/query/and/)
          ✔ AND Queries With Multiple Expressions Specifying the Same Field (16ms)
          ✔ AND Queries With Multiple Expressions Specifying the Same Operator (7ms)
        Logical Operator: $not (https://www.mongodb.com/docs/manual/reference/operator/query/not/)
          ✔ Match Document Fields (9ms)
          ✔ $not and Regular Expressions (26ms)
        Logical Operator: $nor (https://www.mongodb.com/docs/manual/reference/operator/query/nor/)
          ✔ $nor Query with Two Expressions (9ms)
          ✔ $nor and Additional Comparisons (8ms)
          ✔ $nor and $exists (8ms)
        Logical Operator: $or (https://www.mongodb.com/docs/manual/reference/operator/query/or/)
          ✔ Match Document Fields (7ms)
          ✔ $or versus $in (16ms)
          ✔ Nested $or Clauses (8ms)
      Element Query Operators
        Element Query Operator: $exists (https://www.mongodb.com/docs/manual/reference/operator/query/exists/)
          ✔ Exists and Not Equal To (26ms)
          ✔ Null Values (35ms)
        Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/)
          ✔ Querying by Data Type (BSON Code) (17ms)
          ✔ Querying by Data Type (BSON Alias) (18ms)
          ✔ Querying by Data Type ("number") (8ms)
          ✔ Querying by Multiple Data Type (BSON Code) (29ms)
          ✔ Querying by Multiple Data Type (BSON Alias) (30ms)
      Array Query Operators
        Array Query Operator: $all (https://www.mongodb.com/docs/manual/reference/operator/query/all/)
          ✔ Use $all to Match Values (8ms)
          ✔ Use $all with $elemMatch (8ms)
          ✔ Use $all with Scalar Values (7ms)
        Array Query Operator: $elemMatch (https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/)
          ✔ Element Match (28ms)
          ✔ Array of Embedded Documents (26ms)
          ✔ Single Query Condition (36ms)
        Array Query Operator: $size (https://www.mongodb.com/docs/manual/reference/operator/query/size/)
          ✔ Use $size to Match Array Sizes (52ms)
    Z) Ad-Hoc Tests
      ✔ should not match explicit nested fields (33ms)
      ✔ should sort and limit in FindMany2 (108ms)


  120 passing (10s)
```
